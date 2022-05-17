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
  userId: string;
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
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({
    name,
    link,
    description,
    tags,
    userId,
  }: ToolRegisterMutationArgs) => {
    let tool = await ToolModel.findOne({ name });

    if (tool) {
      return {
        error: "Tool already registered!",
      };
    }

    tool = new ToolModel({ name, link, description, tags, userId });

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
