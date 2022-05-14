import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import ToolInterface from "./ToolInterface";

const ToolType = new GraphQLObjectType({
  name: "Tool",
  description: "Tool data",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool: ToolInterface) => tool._id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool: ToolInterface) => tool.name,
    },
    link: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool: ToolInterface) => tool.link,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool: ToolInterface) => tool.description,
    },
    tags: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      resolve: (tool: ToolInterface) => tool.tags,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tool: ToolInterface) => tool.userId,
    },
  }),
});

export default ToolType;
