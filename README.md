# ESPOOGISUI

## Main technologies

* [Angular 2](https://angular.io/) - SPA, Single Page Application framework
* [Open Layers](https://openlayers.org/) - Map library

## Get started

##### Needed tools
* NodeJs & npm ([Installation](https://nodejs.org/en/), Developed with 7.5.0 & 4.1.2)
* Angular-cli ([installation](https://github.com/angular/angular-cli#installation), Developed with 1.0.0-beta.24)

> Note that the application may not work if you use newer angular-cli version.
> The application can be upgraded to support newer angular-cli.

##### Running
* Run `npm install` to install dependencies.
* Run `ng serve` to run frontend application locally without docker
* Open web browser and navigate to `http://locahost:4200`

## Using Angular-cli

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.24.

##### Install dependencies
Run `npm install`. Otherwise `ng build` or `ng serve`will fail.

##### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

##### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

##### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

##### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

##### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

##### Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

##### Building the Docker image

Build application for production:

`ng build --prod`

Build the docker image:

`docker build -t image-name-here .`

Run the docker image:

`docker run -p 80:80 -it image-name-here`

##### Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Local docker development environment

##### Running the services

  - Run `docker-compose up -d`
  - Database can be accessed at localhost:5432, pgadmin/pgadmin, DB name "gis"
  - Geoserver http://localhost:8080/geoserver, admin/geoserver
  - Postgres and Geoserver data will be saved inside /server/docker_data folder

##### Copying data from AWS into local database

  - Run the services
  - Open up bash inside postgis container `docker-compose exec postgis bash`
  - Create a dump of the remote database `pg_dump --host=AWS_HOST --clean --username=AWS_PG_USER AWS_PG_DB > db.dump` (this may take a while)
  - Restore dump into local database `psql --host=localhost --username=pgadmin gis < db.dump`

##### Using local Geoserver instance for development

  - Make sure `geoserver` property inside /src/environments/environment.ts points to `http://localhost:8080/geoserver/espoo`


## AWS environment

### TODO

  - Create a CloudFormation template for building the environment
  - Add more automation, e.g. start/stop services by a script
  - Deploy new versions automatically on commits

### General information

  - Auto Scaling Group is used for launching new EC2 instances and stopping them
  - Auto Scaling Group uses a Launch Configuration which registers the EC2 instance to geoserver ECS cluster and mounts the file system for persisting geoserver configuration
  - Load Balancers directs traffic to EC2 instances
  - Docker images are stored in Amazon ECR
  - Task Definitions are used to define a service from a Docker image in ECR
  - Tasks are run by using Services inside ECS cluster


### Pushing frontend changes to AWS

  - Open EC2 Container Service dashboard in AWS
  - Go to Repositories and select `awsgis-gui` repository
  - View Push Commands -button describes the pushing process
  - After pushing the changes go to Clusters -> geoserver and open Tasks tab. Select `awsgis-gui-task` and stop it. It will then automatically start a new task using the updated Docker image.


### Starting/stopping the service

  - Open EC2 dashboard in AWS
  - Select Auto Scaling Groups
  - Select `geoserver-auto-scaling-group` and in Details tab click Edit.
  - Set Desired, Min and Max values to 0 if you want to stop the service or 1 if you want to start it.
