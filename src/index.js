const { GraphQLServer } = require('graphql-yoga');
const request = require('request-promise-native');

(async () => {
  const response = await request.get(
    'https://service-catalogue-platform.prod.ctmers.io/services/metadata',
    {
      json: true,
    },
  );

  const typeDefs = `
  type Query {
    service: [Service!]!
  }

  type Service {
    name: String!
    owner: String
    repo: String
  }
  `;

  const resolvers = {
    Query: {
      service: () => response,
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
})();
