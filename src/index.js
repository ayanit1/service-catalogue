const { GraphQLServer } = require('graphql-yoga');
const request = require('request-promise-native');

(async () => {
  // data sources
  const response = await request.get("https://service-catalogue-platform.prod.ctmers.io/services/metadata")

  /* 1 - Graphql schema
  Defines a simple Query type with 3 fields called "info", "feed" and "link".
  Info has The field has a type String!. The exclamation mark in the type definition
  means that this field can never be null
  */

  // fetch link by Id
  const typeDefs =`
  type Query {
    name: String!
  }
  `

  /*
    2 - Resolvers
    Implementation of GraphQl schema. It defines a "Query" type with
    one field called "info". Structure is identical to the type definition
    inside typeDefs:Query.info
  */
  const resolvers = {
    Query: {
      name: () => `This is the API of a Hacker News Clone`,
    },
  }

  /*
    3 - Pass on schema and resolvers to graphql server
    Schema and resolvers are bundled to the GraphQL service
    which is imported from GraphQlYoga.
  */

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
  })

  server.start(() => {console.log(`Server is running on http://localhost:4000`)})
})();




