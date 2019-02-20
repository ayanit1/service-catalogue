const k8s = require('@kubernetes/client-node');
const request = require('request-promise-native');

const kc = new k8s.KubeConfig();
const opts = {};

kc.loadFromDefault();
kc.applyToRequest(opts);

module.exports = async () => {
  const response = await request.get(
    `${kc.getCurrentCluster().server}/apis/extensions/v1beta1/deployments`,
    opts,
  );

  return JSON.parse(response).items;
};
