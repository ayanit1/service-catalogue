const { GraphQLServer } = require('graphql-yoga');
const lodash = require('lodash');

const getServiceCatalogue = require('./dataSources/serviceCatalogue.js');
const { getDeployments, getIngressInfo } = require('./dataSources/kubernetes');

const {
  envVariableResolver,
  podInfoResolver,
  isOnPaasResolver,
  serviceUrlResolver,
} = require('./resolvers/paasInfo.js');

let serviceCatalogueResponse;
let deployments;
let ingressInfo;

const getData = async () => {
  try {
    serviceCatalogueResponse = await getServiceCatalogue();
    deployments = await getDeployments();
    ingressInfo = await getIngressInfo();
  } catch (err) {
    console.log(err);
  }
};

const resolvers = {
  Query: {
    services: () => serviceCatalogueResponse,
    service: (_, args) =>
      serviceCatalogueResponse.find(service => service.name === args.name),
    domain: (_, args) =>
      serviceCatalogueResponse.filter(service =>
        service.name.includes(args.name),
      ),
  },
  Service: {
    name: parent => parent.name,
    owner: parent => parent.owner,
    repo: parent => parent.repo,
    podInfo: parent => podInfoResolver(parent.name, deployments),
    isOnPaas: parent => isOnPaasResolver(parent.name, deployments),
    envVars: parent => envVariableResolver(parent.name, deployments),
    urls: parent => serviceUrlResolver(parent.name, ingressInfo),
    dependencies: parent => {
      // todo: refactor
      let critical;
      let nonCritical;
      if (lodash.get(parent.dependencies, 'critical') === undefined) {
        critical = [];
      } else {
        critical = lodash.get(parent.dependencies, 'critical');
      }

      if (lodash.get(parent.dependencies, 'non-critical') === undefined) {
        nonCritical = [];
      } else {
        nonCritical = lodash.get(parent.dependencies, 'non-critical');
      }

      return critical.concat(nonCritical);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/types/index.graphql',
  resolvers,
});

getData().then(() => {
  server.start(() => {
    console.log(`Server is running on http://localhost:4000`);
  });
});
