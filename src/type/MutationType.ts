import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "../modules/user/UserType";
import UserModel from "../modules/user/UserModel";

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
  },
});
