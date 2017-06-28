// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // geoserver: 'https://geoserver.espooinfrao.com/geoserver/espoo',
  geoserver: 'http://localhost:8080/geoserver/espoo',
  projection: 'EPSG:3857',

  aws: {
    region: 'eu-west-1',
    identityPoolId: 'eu-west-1:5bf8165b-c222-4a98-9588-811180a8d9db',
    userPoolId: 'eu-west-1_F55G5oxqd',
    clientId: '303a4stvehvj16fh4d96mo2ka6',
  }
};
