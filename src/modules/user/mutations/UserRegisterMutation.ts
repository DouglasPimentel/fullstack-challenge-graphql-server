import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import UserType from "../UserType";
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
      id: user._id,
      error: null,
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: async ({ id }, _, context) => {
        if (!id) {
          return null;
        }

        return await UserLoader.load(context, id);
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
