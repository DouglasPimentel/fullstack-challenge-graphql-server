import { GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import ToolModel from "../ToolModel";

interface ToolUpdateMutationArgs {
  id: string;
  name?: string;
  link?: string;
  description?: string;
  tags?: string[];
}

export default mutationWithClientMutationId({
  name: "ToolUpdateMutation",
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { id, name, link, description, tags }: ToolUpdateMutationArgs,
    context
  ) => {
    if (!context.userId) {
      return {
        error: "not authenticated",
      };
    }

    const tool = await ToolModel.findById(id);

    if (!tool) {
      return {
        error: "Tool not found",
      };
    }

    await tool.updateOne({ name, link, description, tags });

    return {
      tool: tool._id,
      error: null,
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ tool }) => {
        return `Tool ${tool} updated`;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
