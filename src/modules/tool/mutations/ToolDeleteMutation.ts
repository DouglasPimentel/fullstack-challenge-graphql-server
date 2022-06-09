import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import ToolModel from "../ToolModel";

interface ToolDeleteMutationArgs {
  id: string;
}

export default mutationWithClientMutationId({
  name: "ToolDeleteMutation",
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ id }: ToolDeleteMutationArgs) => {
    const tool = await ToolModel.findById(id);

    if (!tool) {
      return {
        error: "Tool not found",
      };
    }

    await tool.remove();

    return {
      message: "Tool deleted",
      error: null,
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
