import { getDataloaders } from "../src/helper";
import * as loaders from "../src/loader";
import { GraphQLContext } from "../src/types";

export function getContext(context: any): Promise<GraphQLContext> {
  const dataloaders = getDataloaders(loaders);

  return {
    req: {},
    ...context,
    dataloaders,
  };
}
