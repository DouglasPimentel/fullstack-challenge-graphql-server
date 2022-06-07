import { connect, closeDatabase, clearDatabase } from "../../test/database";
import UserModel from "../modules/user/UserModel";
import { decodeToken, generateToken } from "./auth";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("Auth", () => {
  let user;

  it("should generate a token", async () => {
    user = await UserModel.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    const token = generateToken(user);

    expect(token).toBeDefined();
  });

  it("should decode a token", async () => {
    user = await UserModel.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    const token = generateToken(user._id);

    const decoded = decodeToken(token);

    expect(decoded).toBeTruthy();
  });
});
