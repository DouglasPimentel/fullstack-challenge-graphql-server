import { fromGlobalId } from "graphql-relay";

import User, * as UserLoader from "../modules/user/UserLoader";
import UserType from "../modules/user/UserType";
import Tool, * as ToolLoader from "../modules/tool/ToolLoader";
import ToolType from "../modules/tool/ToolType";
import { GraphQLContext } from "../types";

import { nodeDefinitions } from "./node";

const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, context: GraphQLContext) => {
    const { id, type } = fromGlobalId(globalId);

    if (type === "User") {
      return UserLoader.load(context, id);
    }

    if (type === "Tool") {
      return ToolLoader.load(context, id);
    }
  },
  // A method that maps from an object to a type
  // @ts-ignore
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    }

    if (obj instanceof Tool) {
      return ToolType;
    }

    return null;
  }
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
export const NodesField = nodesField;
