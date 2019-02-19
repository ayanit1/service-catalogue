const { Client, config } = require('kubernetes-client');

const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

module.exports = () => client.api.v1.namespaces.get();
