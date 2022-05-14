import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import UserInterface from "./UserInterface";
import ToolType from "../tool/ToolType";
import ToolModel from "../tool/ToolModel";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  description: "User data",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserInterface) => user._id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserInterface) => user.name,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserInterface) => user.email,
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserInterface) => user.password,
    },
    tools: {
      type: new GraphQLList(ToolType),
      resolve: async (parent) => {
        return await ToolModel.find({ userId: parent._id });
      },
    },
  }),
});

export default UserType;
