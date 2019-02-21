const { GraphQLServer } = require('graphql-yoga');

const getServiceCatalogue = require('./dataSources/serviceCatalogue.js');
const { getDeployments, getIngressInfo } = require('./dataSources/kubernetes');

const {
  envVariableResolver,
  podResolver,
  isOnPaasResolver,
} = require('./resolvers/paasInfo.js');
const serviceHostResolver = require('./resolvers/serviceHost');

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
  },
  Service: {
    name: parent => parent.name,
    owner: parent => parent.owner,
    repo: parent => parent.repo,
    pods: parent => podResolver(parent.name, deployments),
    isOnPaas: parent => isOnPaasResolver(parent.name, deployments),
    envVars: parent => envVariableResolver(parent.name, deployments),
    urls: parent => serviceHostResolver(parent.name, ingressInfo),
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
