import {
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { globalIdField } from "graphql-relay";

import Tool from "./ToolLoader";
import { GraphQLContext } from "../../types";
import { connectionDefinitions } from "../../graphql/connection/CustomConnectionType";
import { NodeInterface } from "../../interface/NodeInterface";

type ConfigType = GraphQLObjectTypeConfig<Tool, GraphQLContext>;

const ToolTypeConfig: ConfigType = {
  name: "Tool",
  description: "Tool data",
  fields: () => ({
    id: globalIdField("Tool"),
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool) => tool._id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool) => tool.name,
    },
    link: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool) => tool.link,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool) => tool.description,
    },
    tags: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      resolve: (tool) => tool.tags,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool) => tool.userId,
    },
    created_at: {
      type: GraphQLString,
      resolve: ({ created_at }) =>
        created_at ? created_at.toISOString() : null,
    },
    updated_at: {
      type: GraphQLString,
      resolve: ({ updated_at }) =>
        updated_at ? updated_at.toISOString() : null,
    },
  }),
  interfaces: () => [NodeInterface],
};

const ToolType = new GraphQLObjectType(ToolTypeConfig);

export const ToolConnection = connectionDefinitions({
  name: "Tool",
  nodeType: new GraphQLNonNull(ToolType),
});

export default ToolType;
