const k8s = require('@kubernetes/client-node');
const request = require('request');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.Core_v1Api);

module.exports = async () => {
  const res = await k8sApi.listNamespace();
  const namespaces = res.body.items;

  // console.log(namespaces);

  namespaces.forEach(namespace =>
    request.get(
      `${
        kc.getCurrentCluster().server
      }/apis/extensions/v1beta1/namespaces/${namespace}/deployments`,
      {},
      (error, response, body) => {
        if (error) {
          console.log(`error: ${error}`);
        }
        const deploymentList = JSON.parse(body).items;
        console.log(deploymentList);

        const deployments = deploymentList.map(d => d.metadata.name);
        const list = { team_namespace: namespace, team_services: deployments };
        console.log(list);
        return list;
      },
    ),
  );
};

// working info
// await client.api.v1.namespaces.get();
