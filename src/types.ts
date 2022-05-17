import DataLoader from "dataloader";
import { Types } from "mongoose";
import { Context } from "koa";

import UserInterface from "./modules/user/UserInterface";
import ToolInterface from "./modules/tool/ToolInterface";

export type DataLoaderKey = Types.ObjectId | string | undefined | null | object;

export interface GraphQLDataloaders {
  UserLoader: DataLoader<DataLoaderKey, UserInterface>;
  ToolLoader: DataLoader<DataLoaderKey, ToolInterface>;
}

export type GraphQLContext = {
  dataloaders: GraphQLDataloaders;
  koaContext: Context;
};
