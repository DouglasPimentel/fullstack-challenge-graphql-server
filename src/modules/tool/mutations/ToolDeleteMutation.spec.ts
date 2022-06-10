import { graphql } from "graphql";
import schema from "../../../graphql/schema";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../../../../test/database";
import { getContext } from "../../../../test/getContext";
import ToolModel from "../ToolModel";
import UserModel from "../../user/UserModel";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("Tool Delete Mutation", () => {
  let user = {
    name: "John Doe",
    email: "johndoe@test.com",
    password: "123456",
  };

  let tool = {
    name: "Test Tool",
    link: "https://test.com",
    description: "Test description",
    tags: ["test", "tool"],
  };

  const id = "62a27f4f4df423eee9be4697";

  const query = `
      mutation DeleteTool (
        $id: String!
      ) {
        ToolDeleteMutation (
          input: {
            id: $id
          }
        ) {
          error
        }
      }
    `;

  it("should return not authenticated", async () => {
    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      id,
    };

    const { data } = await graphql({
      schema,
      source: query,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      ToolDeleteMutation: {
        error: "not authenticated",
      },
    });
  });

  it("should return tool not found", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const rootValue = {};
    const contextValue = getContext({ userId: newUser.id });
    const variableValues = {
      id,
    };

    const { data } = await graphql({
      schema,
      source: query,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      ToolDeleteMutation: {
        error: "Tool not found",
      },
    });
  });

  it("should return tool deleted", async () => {
    const newUser = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const newTool = await ToolModel.create({
      ...tool,
      userId: newUser._id,
    });

    const source = `
      mutation DeleteTool (
        $id: String!
      ) {
        ToolDeleteMutation (
          input: {
            id: $id
          }
        ) {
          message
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext({ userId: newUser._id });
    const variableValues = {
      id: newTool._id.toString(),
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    await newTool.remove();

    expect(data).toEqual({
      ToolDeleteMutation: {
        message: "Tool deleted",
        error: null,
      },
    });
  });
});
