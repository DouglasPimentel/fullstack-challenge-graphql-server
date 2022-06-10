import { graphql } from "graphql";
import schema from "../../../graphql/schema";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../../../../test/database";
import { getContext } from "../../../../test/getContext";
import UserModel from "../UserModel";
import UserInterface from "../UserInterface";
import { generateToken } from "../../../auth/auth";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("User login Mutation", () => {
  let user = {
    name: "John Doe",
    email: "johndoe@test.com",
    password: "123456",
  };

  let newUser: UserInterface;

  it("should returned error of password invalid", async () => {
    newUser = await UserModel.create({
      ...user,
    });

    const source = `
      mutation LoginUser (
        $email: String!
        $password: String!
      ) {
        UserLoginMutation (
          input: {
            email: $email
            password: $password
          }
        ) {
          token
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      email: newUser.email,
      password: newUser.password,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      UserLoginMutation: {
        error: "Password incorrect!",
        token: null,
      },
    });
  });

  it("should returned error of email not registered", async () => {
    const source = `
      mutation LoginUser (
        $email: String!
        $password: String!
      ) {
        UserLoginMutation (
          input: {
            email: $email
            password: $password
          }
        ) {
          token
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      email: user.email,
      password: user.password,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      UserLoginMutation: {
        error: "Email not registered!",
        token: null,
      },
    });
  });

  it("should login a user", async () => {
    newUser = await UserModel.create({
      ...user,
    });

    const source = `
      mutation LoginUser (
        $email: String!
        $password: String!
      ) {
        UserLoginMutation (
          input: {
            email: $email
            password: $password
          }
        ) {
          token
          error
        }
      }
    `;

    const token = generateToken(newUser._id);

    const rootValue = {};
    const contextValue = getContext({ userId: token });
    const variableValues = {
      email: user.email,
      password: user.password,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      UserLoginMutation: {
        token: expect.any(String),
        error: null,
      },
    });
  });
});
