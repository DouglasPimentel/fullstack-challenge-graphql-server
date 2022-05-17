import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { UserConnection } from "../UserType";
import UserModel from "../UserModel";

import * as UserLoader from "../UserLoader";

interface UserRegisterMutationArgs {
  name: string;
  email: string;
  password: string;
}

export default mutationWithClientMutationId({
  name: "UserRegisterMutation",
  inputFields: {
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
  mutateAndGetPayload: async ({
    name,
    email,
    password,
  }: UserRegisterMutationArgs) => {
    let user = await UserModel.findOne({ email });

    if (user) {
      return {
        error: "Email already registered!",
      };
    }

    user = new UserModel({ name, email, password });

    await user.save();

    return {
      user: user._id,
      error: null,
    };
  },
  outputFields: {
    userEdge: {
      type: UserConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newUser = await UserLoader.load(context, id);

        if (!newUser) {
          return null;
        }

        return {
          cursor: toGlobalId("User", newUser._id),
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
