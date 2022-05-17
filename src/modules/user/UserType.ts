import {
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";

import User from "./UserLoader";
import { GraphQLContext } from "../../types";
import { connectionDefinitions } from "../../graphql/connection/CustomConnectionType";
import { NodeInterface } from "../../interface/NodeInterface";

type ConfigType = GraphQLObjectTypeConfig<User, GraphQLContext>;

const UserTypeConfig: ConfigType = {
  name: "User",
  description: "User data",
  fields: () => ({
    id: globalIdField("User"),
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user._id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.name,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email,
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.password,
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

const UserType = new GraphQLObjectType(UserTypeConfig);

export const UserConnection = connectionDefinitions({
  name: "User",
  nodeType: new GraphQLNonNull(UserType),
});

export default UserType;
