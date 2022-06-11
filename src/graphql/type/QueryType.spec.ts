import { graphql } from "graphql";
import schema from "../schema";
import { connect, clearDatabase, closeDatabase } from "../../../test/database";
import { getContext } from "../../../test/getContext";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("Query Tests", () => {
  it("should return void list of tools", async () => {
    const contextValue = getContext;

    const query = `
      query {
        tools {
          edges {
            node {
              _id
              name
              link
              description
              tags
              userId
              created_at
              updated_at
            }
          }
        }
      }
    `;

    const { data } = await graphql({
      schema,
      source: query,
      contextValue,
    });

    expect(data).toEqual({
      tools: {
        edges: [],
      },
    });
  });
});
