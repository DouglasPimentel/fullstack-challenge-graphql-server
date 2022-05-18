import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import UserModel from "../UserModel";
import { generateToken } from "../../../auth/auth";

interface UserLoginMutationArgs {
  email: string;
  password: string;
}

export default mutationWithClientMutationId({
  name: "UserLoginMutation",
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }: UserLoginMutationArgs) => {
    let user = await UserModel.findOne({ email });

    if (!user) {
      return {
        error: "Email not registered!",
      };
    }

    if (!user.comparePassword(password)) {
      return {
        error: "Password incorrect!",
      };
    }

    return {
      token: generateToken(user._id),
      error: null,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
