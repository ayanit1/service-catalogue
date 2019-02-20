const { GraphQLServer } = require('graphql-yoga');

const getServiceCatalogue = require('./dataSources/serviceCatalogue.js');
const getKubernetesData = require('./dataSources/kubernetes');

const envVariableResolver = require('./resolvers/envVariables.js');

let serviceCatalogueResponse;
let kubernetesResponse;

const getData = async () => {
  try {
    serviceCatalogueResponse = await getServiceCatalogue();
    kubernetesResponse = await getKubernetesData();
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
    envVars: parent => envVariableResolver(parent.name, kubernetesResponse),
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
