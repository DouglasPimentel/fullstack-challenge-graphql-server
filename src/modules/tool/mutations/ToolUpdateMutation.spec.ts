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

  it("should return not authenticated", async () => {
    const source = `
      mutation UpdateTool (
        $id: String!
        $name: String!
      ) {
        ToolUpdateMutation (
          input: {
            id: $id
            name: $name
          }
        ) {
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext;
    const variableValues = {
      id,
      name: tool.name,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      ToolUpdateMutation: {
        error: "not authenticated",
      },
    });
  });

  it("should return tool not found", async () => {
    const newUser = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const source = `
      mutation UpdateTool (
        $id: String!
        $name: String!
      ) {
        ToolUpdateMutation (
          input: {
            id: $id
            name: $name
          }
        ) {
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext({ userId: newUser.id });
    const variableValues = {
      id,
      name: tool.name,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      ToolUpdateMutation: {
        error: "Tool not found",
      },
    });
  });

  it("should update a tool", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const newTool = await ToolModel.create({
      ...tool,
      userId: newUser._id,
    });

    const newName = "New Test Tool";

    const source = `
      mutation UpdateTool (
        $id: String!
        $name: String!
      ) {
        ToolUpdateMutation (
          input: {
            id: $id
            name: $name
          }
        ) {
          message
          error
        }
      }
    `;

    const rootValue = {};
    const contextValue = getContext({ userId: newUser.id });
    const variableValues = {
      id: newTool._id.toString(),
      name: newName,
    };

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    await newTool.updateOne({ name: newName });

    expect(data).toEqual({
      ToolUpdateMutation: {
        message: `Tool ${newTool._id} updated`,
        error: null,
      },
    });
  });
});
