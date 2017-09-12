const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const binaryMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/apng',
  'image/webp',
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.handler = (event, context) => {
  // API gateway does not support gzipped content, decoding fails on the client.
  // Settings Accept-Encoding header to identity is a workaround until it is
  // supported.
  event.headers['Accept-Encoding'] = 'identity';
  awsServerlessExpress.proxy(server, event, context);
}
