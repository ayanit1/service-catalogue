const { Client, config } = require('kubernetes-client');

const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

module.exports = async () => {
  console.log(client.api.v1.pods.get());
  const response = await client.api.v1.pods.get();

  return JSON.stringify(response.body.items[0]);
};
