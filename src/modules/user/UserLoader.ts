import {
  connectionFromMongoCursor,
  mongooseLoader,
} from "@entria/graphql-mongoose-loader";
import DataLoader from "dataloader";
import { ConnectionArguments } from "graphql-relay";
import { Types } from "mongoose";

import { GraphQLContext, DataLoaderKey } from "../../types";

import UserModel from "./UserModel";
import UserInterface from "./UserInterface";

export default class User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;

  constructor(data: UserInterface) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

const viewerCanSee = () => true;

export const getLoader = () =>
  new DataLoader<DataLoaderKey, User>((ids) =>
    mongooseLoader(UserModel, ids as any)
  );

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  let data: UserInterface;

  try {
    data = await context.dataloaders.UserLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new User(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.UserLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: UserInterface
) => dataloaders.UserLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: UserInterface
) => clearCache(context, id) && primeCache(context, id, data);

interface LoadUserArgs extends ConnectionArguments {
  search?: string;
}

export const loadUsers = async (
  context: GraphQLContext,
  args: LoadUserArgs
) => {
  return await connectionFromMongoCursor({
    cursor: UserModel.find({}).sort({ created_at: 1 }),
    context,
    args,
    loader: load,
  });
};
