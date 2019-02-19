const { GraphQLServer } = require('graphql-yoga');
const getServiceCatalogue = require('./dataSources/serviceCatalogue.js');

let serviceCatalogueResponse;

(async () => {
  try {
    serviceCatalogueResponse = await getServiceCatalogue();
  } catch (err) {
    console.log(err);
  }
})();

const typeDefs = `
  type Query {
    services: [Service!]!
    service(name: String!): Service
  }

  type Service {
    name: String!
    owner: String
    repo: String
  }
  `;

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
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log(`Server is running on http://localhost:4000`);
});
