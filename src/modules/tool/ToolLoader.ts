import {
  connectionFromMongoCursor,
  mongooseLoader,
} from "@entria/graphql-mongoose-loader";
import DataLoader from "dataloader";
import { ConnectionArguments } from "graphql-relay";
import { Types } from "mongoose";

import { GraphQLContext, DataLoaderKey } from "../../types";

import ToolModel from "./ToolModel";
import ToolInterface from "./ToolInterface";

export default class Tool {
  id: string;
  _id: string;
  name: string;
  link: string;
  description: string;
  tags: string[];
  userId: Types.ObjectId;
  created_at: Date;
  updated_at: Date;

  constructor(data: ToolInterface) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.name = data.name;
    this.link = data.link;
    this.description = data.description;
    this.tags = data.tags;
    this.userId = data.userId;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

const viewerCanSee = () => true;

export const getLoader = () =>
  new DataLoader<DataLoaderKey, Tool>((ids) =>
    mongooseLoader(ToolModel, ids as any)
  );

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  let data;

  try {
    data = await context.dataloaders.ToolLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new Tool(data) : null;
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
  data: ToolInterface
) => dataloaders.ToolLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: ToolInterface
) => clearCache(context, id) && primeCache(context, id, data);

interface LoadToolArgs extends ConnectionArguments {
  search?: string;
}

export const loadTools = async (
  context: GraphQLContext,
  args: LoadToolArgs
) => {
  return await connectionFromMongoCursor({
    cursor: ToolModel.find({}).sort({ created_at: 1 }),
    context,
    args,
    loader: load,
  });
};
