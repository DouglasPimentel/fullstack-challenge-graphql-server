import { connect, closeDatabase, clearDatabase } from "../../test/database";
import UserModel from "../modules/user/UserModel";
import UserInterface from "../modules/user/UserInterface";
import { decodeToken, generateToken } from "./auth";

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("Auth", () => {
  let user = {
    name: "John Doe",
    email: "johndoe@test.com",
    password: "123456",
  };

  let newUser: UserInterface;

  it("should generate a token", async () => {
    newUser = await UserModel.create({
      ...user,
    });

    const token = generateToken(newUser._id);

    expect(token).toBeDefined();
  });

  it("should decode a token", async () => {
    newUser = await UserModel.create({
      ...user,
    });

    const token = generateToken(newUser._id);

    const decoded = decodeToken(token);

    expect(decoded).toBeTruthy();
  });

  it("should throw an error when decoding a token with an invalid secret", async () => {
    newUser = await UserModel.create({
      ...user,
    });

    const token = generateToken(newUser._id);

    expect(() => decodeToken(token + "invalid")).toThrowError();
  });

  it("should return error no token found", async () => {
    expect(() => decodeToken("")).toThrow("No token found");
  });
});
