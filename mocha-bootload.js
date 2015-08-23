require('babel/register');

process.on('unhandledRejection', function handlePromise(error) {
  /* eslint no-console: 0 */
  console.error('Unhandled Promise Rejection:');
  console.error(error && error.stack || error);
});
