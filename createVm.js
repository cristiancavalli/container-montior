const randomWord = require('random-word');
const gce = require('@google-cloud/compute');
const DockerMetaDataContainer = require('./DockerMetaDataContainer.js');
const newVm = {
  zone: gce.zone('us-central1-a'),
  name: [randomWord(), randomWord()].join('-')
};

newVm.zone.createVm(newVm.name,
  (new DockerMetaDataContainer(newVm.name)).export(),
  function (err, vm, operation) {
    var lifecycleTimer;
    operator
      .on('error', function (e) {
        console.error('Error in creating VM', e);
      })
      .on('running', function (metadata) {
        console.log('VM is now running');
        console.log(metadata);
      })
      .on('complete', function () {
        console.log('VM is now ready');
        lifecycleTimer = setTimeout(function () {
          vm.delete(function (err, operation, apiResponse) {
            if (err) {
              console.error('Error in deleting VM:', err);
              return;
            }
            console.log('VM was successfully deleted');
          }, 350000);
        })
      });
  }
);
