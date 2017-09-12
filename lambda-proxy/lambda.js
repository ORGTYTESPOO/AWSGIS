const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const binaryMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/apng',
  'image/webp',
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
