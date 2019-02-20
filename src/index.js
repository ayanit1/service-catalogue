const { GraphQLServer } = require('graphql-yoga');

const getServiceCatalogue = require('./dataSources/serviceCatalogue.js');
const getKubernetesData = require('./dataSources/kubernetes');

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
    envVars: parent => {
      const serviceName = parent.name.replace('.', '-');
      const response = kubernetesResponse.find(
        service => service.metadata.name === serviceName,
      );
      const envVariables = response.spec.template.spec.containers[0].env;

      const array = [];
      envVariables.forEach(variable => {
        if (variable.valueFrom) {
          array.push({
            name: variable.name,
            value: 'REDACTED',
          });
          return;
        }

        array.push(variable);
      });

      return array;
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
