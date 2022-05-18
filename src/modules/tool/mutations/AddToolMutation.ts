import { GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { ToolConnection } from "../ToolType";
import ToolModel from "../ToolModel";

import * as ToolLoader from "../ToolLoader";

interface ToolRegisterMutationArgs {
  name: string;
  link: string;
  description: string;
  tags: string[];
}

export default mutationWithClientMutationId({
  name: "AddToolMutation",
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    link: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    },
  },
  mutateAndGetPayload: async (
    { name, link, description, tags }: ToolRegisterMutationArgs,
    context
  ) => {
    if (!context.userId) {
      return {
        error: "not authenticated",
      };
    }

    let tool = await ToolModel.findOne({ name });

    if (tool) {
      return {
        error: "Tool already registered!",
      };
    }

    tool = new ToolModel({
      name,
      link,
      description,
      tags,
      userId: context.userId.id,
    });

    await tool.save();

    return {
      tool: tool._id,
      error: null,
    };
  },
  outputFields: {
    toolEdge: {
      type: ToolConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newTool = await ToolLoader.load(context, id);

        if (!newTool) {
          return null;
        }

        return {
          cursor: toGlobalId("Tool", newTool._id),
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
