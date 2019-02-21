const k8s = require('@kubernetes/client-node');
const request = require('request-promise-native');
const lodash = require('lodash');

const kc = new k8s.KubeConfig();
const opts = {};

kc.loadFromDefault();
kc.applyToRequest(opts);

module.exports = {
  getDeployments: async () => {
    const response = await request.get(
      `${kc.getCurrentCluster().server}/apis/extensions/v1beta1/deployments`,
      opts,
    );

    return JSON.parse(response).items;
  },
  getIngressInfo: async () => {
    const response = await request.get(
      `${kc.getCurrentCluster().server}/apis/extensions/v1beta1/ingresses`,
      opts,
    );

    const parsedResponse = JSON.parse(response).items;

    const sanitisedResponse = parsedResponse.map(service =>
      lodash.get(service, 'spec.rules'),
    );

    return lodash.flatten(sanitisedResponse);
  },
};
