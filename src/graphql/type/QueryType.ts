import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";

import { NodeField, NodesField } from "../../interface/NodeInterface";

import { GraphQLContext } from "../../types";
import * as UserLoader from "../../modules/user/UserLoader";
import * as ToolLoader from "../../modules/tool/ToolLoader";

import UserType, { UserConnection } from "../../modules/user/UserType";
import { ToolConnection } from "../../modules/tool/ToolType";

export default new GraphQLObjectType<GraphQLContext, any>({
  name: "Query",
  description: "The root of all... queries",
  fields: () => ({
    id: globalIdField("Query"),
    node: NodeField,
    nodes: NodesField,
    tools: {
      type: new GraphQLNonNull(ToolConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context) => {
        return await ToolLoader.loadTools(context, args);
      },
    },
  }),
});
