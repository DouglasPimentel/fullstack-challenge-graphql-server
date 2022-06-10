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

describe("Add Tool Mutation", () => {
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

  const query = `
      mutation AddTool (
        $name: String!
        $link: String!
        $description: String!
        $tags: [String]!
      ) {
        AddToolMutation (
          input: {
            name: $name
            link: $link
            description: $description
            tags: $tags
          }
        ) {
          error
        }
      }
    `;

  it("should return not authenticated", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const rootValue = {};
    const contextValue = getContext(newUser._id);
    const variableValues = {
      ...tool,
    };

    const { data } = await graphql({
      schema,
      source: query,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      AddToolMutation: {
        error: "not authenticated",
      },
    });
  });

  it("should return error if tool already exists", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const newTool = await ToolModel.create({
      ...tool,
      userId: newUser._id,
    });

    const rootValue = {};
    const contextValue = getContext({ userId: newUser._id });
    const variableValues = {
      ...tool,
    };

    const { data } = await graphql({
      schema,
      source: query,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      AddToolMutation: {
        error: "Tool already registered!",
      },
    });
  });

  it("should register a new tool", async () => {
    const newUser = await UserModel.create({
      ...user,
    });

    const rootValue = {};
    const contextValue = getContext({ userId: newUser._id });
    const variableValues = {
      ...tool,
    };

    const source = `
      mutation AddTool (
        $name: String!
        $link: String!
        $description: String!
        $tags: [String]!
      ) {
        AddToolMutation (
          input: {
            name: $name
            link: $link
            description: $description
            tags: $tags
          }
        ) {
          tool {
            name
          }
          error
        }
      }
    `;

    const { data } = await graphql({
      schema,
      source,
      rootValue,
      contextValue,
      variableValues,
    });

    expect(data).toEqual({
      AddToolMutation: {
        tool: {
          name: tool.name,
        },
        error: null,
      },
    });
  });
});
