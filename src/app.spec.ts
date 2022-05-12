import supertest from "supertest";
import app from "./app";

describe("Root route test", () => {
  let response;

  it("should return response with status code 200", async () => {
    response = await supertest(app.callback()).get("/");

    expect(response.statusCode).toBe(200);
  });
  it("should return GraphQL Server message when using root route", async () => {
    response = await supertest(app.callback()).get("/");

    expect(response.body).toEqual({ message: "GraphQL Server" });
  });
});
