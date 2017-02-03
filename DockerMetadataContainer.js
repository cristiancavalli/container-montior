const merge = require('lodash.merge');

class DockerMetaDataContainer {
  constructor (name) {

    this.apiVersion = 'v1';
    this.kind = 'Pod',
    this.metadata = {
      name: name
    };
    this.metadata = {
      items: [
        {
          name: name,
          image: 'us.gcr.io/ccavalli-test-me/node-7-googleauth-test:latest',
          imagePullPolicy: 'Always'
        },
        {
          "key": "user-data",
          "value": "#cloud-config\nruncmd:\n- [ '/usr/bin/kubelet', '--allow-privileged=false', '--manifest-url=http://metadata.google.internal/computeMetadata/v1/instance/attributes/google-container-manifest', '--manifest-url-header=Metadata-Flavor:Google', '--config=/etc/kubernetes/manifests' ]"
        },
        {
          "key": "gci-ensure-gke-docker",
          "value": "true"
        }
      ]
    };
    this.tags = {
      items: []
    };
    this.disks = [
      {
        "type": "PERSISTENT",
        "boot": true,
        "mode": "READ_WRITE",
        "autoDelete": true,
        "deviceName": "instance-1",
        "initializeParams": {
          "sourceImage": "https://www.googleapis.com/compute/v1/projects/google-containers/global/images/gci-stable-55-8872-77-0",
          "diskType": "projects/ccavalli-test-me/zones/us-central1-a/diskTypes/pd-standard",
          "diskSizeGb": "10"
        }
      }
    ];
    this.canIpForward = false;
    this.networkInterfaces = [
      {
        "network": "projects/ccavalli-test-me/global/networks/default",
        "subnetwork": "projects/ccavalli-test-me/regions/us-central1/subnetworks/default",
        "accessConfigs": [
          {
            "name": "External NAT",
            "type": "ONE_TO_ONE_NAT"
          }
        ]
      }
    ]
    this.description= "";
    this.scheduling = {
      preemptible: false,
      onHostMaintenance: "MIGRATE",
      automaticRestart: false
    };
    this.serviceAccounts = [
      {
        email: "374924138533-compute@developer.gserviceaccount.com",
        scopes: [
          "https://www.googleapis.com/auth/devstorage.read_only",
          "https://www.googleapis.com/auth/logging.write",
          "https://www.googleapis.com/auth/monitoring.write",
          "https://www.googleapis.com/auth/servicecontrol",
          "https://www.googleapis.com/auth/service.management.readonly",
          "https://www.googleapis.com/auth/trace.append"
        ]
      }
    ];
  }

  export() {
    return merge({}, this);
  }
}

module.exports = DockerMetaDataContainer;
