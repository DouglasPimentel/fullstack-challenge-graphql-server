import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from "graphql";
import UserType from "../modules/user/UserType";
import UserModel from "../modules/user/UserModel";
import ToolType from "../modules/tool/ToolType";
import ToolModel from "../modules/tool/ToolModel";

export default new GraphQLObjectType({
  name: "Mutation",
  description: "All mutations",
  fields: {
    registerUser: {
      type: UserType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (parent, args) => {
        const user = await UserModel.create({
          name: args.name,
          email: args.email,
          password: args.password,
        });

        return user;
      },
    },
    userLogin: {
      type: UserType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (parent, args) => {
        const user = await UserModel.findOne({ email: args.email });

        if (user?.comparePassword(args.password)) {
          return user;
        }
      },
    },
    addTool: {
      type: ToolType,
      args: {
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
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (parent, args) => {
        const tool = ToolModel.create({
          name: args.name,
          link: args.link,
          description: args.description,
          tags: args.tags,
          userId: args.userId,
        });

        return tool;
      },
    },
  },
});
