import Koa, { Context, Request, Response, Next } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { graphqlHTTP, OptionsData } from "koa-graphql";
import koaPlayground from "graphql-playground-middleware-koa";

import * as loaders from "./loader";
import { GraphQLContext } from "./types";
import { getDataloaders } from "./helper";
import schema from "./graphql/schema";
import { GraphQLError } from "graphql";

import { decodeToken } from "./auth/auth";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = {
    message: "GraphQL Server",
  };
});

// Middleware to get dataloaders
app.use((ctx, next) => {
  ctx.dataloaders = getDataloaders(loaders);
  return next();
});

router.all(
  "/graphql",
  graphqlHTTP(
    async (
      request: Request,
      ctx: Response,
      koaContext: Context
    ): Promise<OptionsData> => {
      const { dataloaders } = koaContext;

      const token =
        request && request.headers.authorization
          ? decodeToken(request.headers.authorization)
          : null;

      return {
        graphiql: true,
        schema,
        rootValue: {
          request: ctx.req,
        },
        context: {
          dataloaders,
          koaContext,
          userId: token,
        } as GraphQLContext,
        extensions: () => {
          return null as any;
        },
        customFormatErrorFn: (error: GraphQLError) => {
          if (error.name || error.name !== "GraphQLError") {
            console.error(error);
          } else {
            console.log("GraphQLWrongQuery:", error.message);
          }

          if (error.name && error.name === "BadRequestError") {
            ctx.status = 400;
            ctx.body = "Bad Request";
            return {
              message: "Bad Request",
            };
          }

          console.error("GraphQL Error", { error });

          return {
            message: error.message,
            locations: error.locations,
            stack: error.stack,
          };
        },
      };
    }
  )
);
router.all("/playground", koaPlayground({ endpoint: "/graphql" }));

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export default app;
