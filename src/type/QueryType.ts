import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import UserType from "../modules/user/UserType";
import UserModel from "../modules/user/UserModel";

export default new GraphQLObjectType({
  name: "Query",
  description: "All queries",
  fields: {
    message: {
      type: GraphQLString,
      resolve: () => "GraphQL Server",
    },
    me: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (parent, args) => {
        const user = await UserModel.findOne({ _id: args.id });

        return user;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return await UserModel.find();
      },
    },
  },
});
