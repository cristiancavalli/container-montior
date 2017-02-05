const spawn = require('child_process').spawn;
const randomWord = require('random-word');
const merge = require('lodash.merge');
const kubectl = process.env.KUBECTL;
const image = 'us.gcr.io/ccavalli-test-me/node-7-googleauth-test:latest';

function deployImage (config) {
  console.log('#########################');
  console.log('#### DEPLOYING IMAGE ####');
  console.log('#########################');
  return new Promise(function (resolve, reject) {
    var buf = '';
    var output = null;
    var targetUpsteam = `"FETCH_FROM=${config.request.upstream}"`;
    var prUrl = `"PR_URL=${config.request.prUrl}"`
    var s = spawn(kubectl, ['run', '-o', 'json', config.cluster.name,
      '--image='+image, '--port=80', '--env='+targetUpsteam, '--env='+prUrl])
      .on('close', function () {
        setImmediate(function () {
           if (output === null) {
              reject(null);
              return;
            }
            console.log('########################');
            console.log('#### IMAGE DEPLOYED ####');
            console.log('########################');
            resolve(merge(clusterInfo, {
              image: {
                run: output
              }
            }));
        });
      });
      s.stdout.on('data', function (chunk) {
        buf += chunk;
        try {
          output = JSON.parse(buf.trim());
        } catch (e) {
          output = null;
        }
      });
      s.stderr.pipe(process.stdout);
  });
}


module.exports = deployImage;
