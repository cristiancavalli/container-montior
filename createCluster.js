const spawn = require('child_process').spawn;
const randomWord = require('random-word');
const merge = require('lodash.merge');
const gcloud = process.env.GCLOUD;

function createCluster (config) {
  const clusterName = ['ga-subsidiary', randomWord(), randomWord()].join('-')
    .slice(0, 39);
  console.log('##########################');
  console.log('#### CREATING CLUSTER ####');
  console.log('##########################');
  return new Promise(function (resolve, reject) {
    var buf = '';
    var output = null;
    var s = spawn(gcloud, ['container', 'clusters', 'create', clusterName, 
      '--num-nodes', '1', '--machine-type', 'g1-small', '--format', 'json'])
      .on('close', function () {
        setImmediate(function () {
           if (output === null) {
              reject(null);
              return;
            }
            console.log('#########################');
            console.log('#### CLUSTER CREATED ####');
            console.log('#########################');
            resolve(merge(config, {
              cluster: {
                name: clusterName, 
                creation: output
              },
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


module.exports = createCluster;
