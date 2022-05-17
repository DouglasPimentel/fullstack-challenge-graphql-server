import { GraphQLObjectType } from "graphql";
import UserMutations from "../../modules/user/mutations";
import ToolMutations from "../../modules/tool/mutations";

export default new GraphQLObjectType({
  name: "Mutation",
  description: "All mutations",
  fields: () => ({
    ...UserMutations,
    ...ToolMutations,
  }),
});
