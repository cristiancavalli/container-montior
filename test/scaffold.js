const createCluster = require('../createCluster');
const deployImage = require('../deployImage');

createCluster({upstream: 'git://github.com/stephenplusplus/google-auto-auth', PR_URL: 'https://google.com'})
  .then(deployImage)
  .then((res) => console.log('Completed!\n', res))
  .catch((e) => console.error(e));
