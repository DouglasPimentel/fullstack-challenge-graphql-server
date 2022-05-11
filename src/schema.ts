import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "All queries",
    fields: {
      message: {
        type: GraphQLString,
        resolve: () => "GraphQL Server",
      },
    },
  }),
});

export default schema;
