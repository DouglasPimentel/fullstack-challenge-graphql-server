import { graphql } from "graphql";
import schema from "../../../graphql/schema";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../../../../test/database";
import { getContext } from "../../../../test/getContext";
import UserModel from "../UserModel";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("User Register Mutation", () => {
  let user = {
    name: "John Doe",
    email: "johndoe@test.com",
    password: "123456",
  };

  const source = `
      mutation RegisterUser (
        $name: String!
        $email: String!
        $password: String!
      ) {
        UserRegisterMutation (
          input: {
            name: $name
            email: $email
            password: $password
          }
        ) {
          user {
            _id
          }
          error
        }
      }
    `;

  it("should not register with an existing email", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      name: newUser.name,
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
      UserRegisterMutation: {
        user: null,
        error: "Email already registered!",
      },
    });
  });

  it("should register a new user", async () => {
    const query = `
      mutation RegisterUser (
        $name: String!
        $email: String!
        $password: String!
      ) {
        UserRegisterMutation (
          input: {
            name: $name
            email: $email
            password: $password
          }
        ) {
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      ...user,
    };

    const { data } = await graphql({
      schema,
      source: query,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      UserRegisterMutation: {
        error: null,
      },
    });
  });

  it("should not register with an invalid email", async () => {
    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      name: user.name,
      email: "invalid-email",
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
      UserRegisterMutation: {
        user: null,
        error: null,
      },
    });
  });
});
