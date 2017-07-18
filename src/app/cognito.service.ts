import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import {
    AuthenticationDetails,
    CognitoIdentityServiceProvider,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import * as STS from "aws-sdk/clients/sts";

// NOTE: https://github.com/aws/amazon-cognito-identity-js used as a reference

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean, jwtToken: string): void;
}

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void
}

@Injectable()
export class CognitoService {

  private static REGION = environment.aws.region;

  private static IDENTITY_POOL_ID = environment.aws.identityPoolId;
  private static USER_POOL_ID = environment.aws.userPoolId;
  private static CLIENT_ID = environment.aws.clientId;

  private static POOL_DATA = {
      UserPoolId: CognitoService.USER_POOL_ID,
      ClientId: CognitoService.CLIENT_ID
  };

  private cognitoCreds: AWS.CognitoIdentityCredentials;

  constructor() { }

  // AWS Stores Credentials in many ways, and with TypeScript this means that
  // getting the base credentials we authenticated with from the AWS globals gets really murky,
  // having to get around both class extension and unions. Therefore, we're going to give
  // developers direct access to the raw, unadulterated CognitoIdentityCredentials
  // object at all times.
  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
      this.cognitoCreds = creds;
  }

  // This method takes in a raw jwtToken and uses the global AWS config options to build a
  // CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
  // to avoid unnecessary calls to setCognitoCreds.
  buildCognitoCreds(idTokenJwt: string) {
      let url = 'cognito-idp.' + CognitoService.REGION.toLowerCase() + '.amazonaws.com/' + CognitoService.USER_POOL_ID;
      let logins: CognitoIdentity.LoginsMap = {};
      logins[url] = idTokenJwt;
      let params = {
          IdentityPoolId: CognitoService.IDENTITY_POOL_ID, /* required */
          Logins: logins
      };
      let creds = new AWS.CognitoIdentityCredentials(params);
      this.setCognitoCreds(creds);
      return creds;
  }

  getUserPool() {
      return new CognitoUserPool(CognitoService.POOL_DATA);
  }

  getCurrentUser() {
      return this.getUserPool().getCurrentUser();
  }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback === null) {
      throw new Error('No callback provided');
    }

    const cognitoUser = this.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession(function (err, session) {
          if (err) {
              callback.isLoggedIn(err, false, null);
          }
          else {
            callback.isLoggedIn(null, session.isValid(), session.idToken.jwtToken);
          }
      });
    } else {
      callback.isLoggedIn('', false, null);
    }
  }

  login(username: string, password: string, callback: CognitoCallback) {
    const authenticationData = {
        Username: username,
        Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
        Username: username,
        Pool: this.getUserPool()
    };

    const cognitoUser = new CognitoUser(userData);
    const self = this;

    cognitoUser.authenticateUser(authenticationDetails, {
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          callback.cognitoCallback(`User needs to set password.`, null);
        },

        onSuccess: function (result) {
            const creds = self.buildCognitoCreds(result.getIdToken().getJwtToken());

            AWS.config.credentials = creds;

            // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
            // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
            // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
            // security credentials. The identity is then injected directly into the credentials object.
            // If the first SDK call we make wants to use our IdentityID, we have a
            // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
            // very innocuous API call that forces this behavior.
            let sts = new STS();
            sts.getCallerIdentity(function (err, data) {
                callback.cognitoCallback(null, result);
            });

        },

        onFailure: function (err) {
          console.log('Login failed', err);
          callback.cognitoCallback(err.message, null);
        },
    });
  }

  changePassword(username: string, oldPassword: string, newPassword: string, callback: CognitoCallback) {
    let authenticationData = {
        Username: username,
        Password: oldPassword,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
        Username: username,
        Pool: this.getUserPool()
    };

    console.log("UserLoginService: Params set...Authenticating the user");
    let cognitoUser = new CognitoUser(userData);
    console.log("UserLoginService: config is " + AWS.config);
    cognitoUser.authenticateUser(authenticationDetails, {
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;
            cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, {
                onSuccess: function (result) {
                    callback.cognitoCallback(null, userAttributes);
                },
                onFailure: function (err) {
                    callback.cognitoCallback(err, null);
                }
            });
        },
        onSuccess: function (result) {
            callback.cognitoCallback(null, result);
        },
        onFailure: function (err) {
            callback.cognitoCallback(err, null);
        }
    });
  }
}
