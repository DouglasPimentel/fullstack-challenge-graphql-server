import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import UserInterface from "./UserInterface";

const UserType = new GraphQLObjectType({
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
  }),
});

export default UserType;
