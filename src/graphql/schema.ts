import { GraphQLSchema } from "graphql";
import QueryType from "./type/QueryType";
import MutationQuery from "./type/MutationType";

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationQuery,
});

export default schema;
