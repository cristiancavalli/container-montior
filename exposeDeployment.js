const spawn = require('child_process').spawn;
const randomWord = require('random-word');
const merge = require('lodash.merge');
const kubectl = process.env.KUBECTL;

function deployImage (clusterInfo) {
  console.log('#############################');
  console.log('#### EXPOSING DEPLOYMENT ####');
  console.log('#############################');
  return new Promise(function (resolve, reject) {
    var buf = '';
    var output = null;
    var s = spawn(kubectl, ['expose', '-o', 'json', clusterInfo.name,
      '--type="LoadBalancer"'])
      .on('close', function () {
        setImmediate(function () {
           if (output === null) {
              reject(null);
              return;
            }
            console.log('############################');
            console.log('#### DEPLOYMENT EXPOSED ####');
            console.log('############################');
            resolve(merge(clusterInfo, {
              clusterRunOutput: output
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
