// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  geoserver: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo',
  // geoserver: 'http://localhost:8080/geoserver/espoo',
  projection: 'EPSG:3857'
};
