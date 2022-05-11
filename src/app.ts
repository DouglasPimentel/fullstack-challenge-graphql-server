import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { graphqlHTTP } from "koa-graphql";
import koaPlayground from "graphql-playground-middleware-koa";
import schema from "./schema";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = {
    message: "GraphQL Server",
  };
});

router.all("/graphql", graphqlHTTP({ schema, graphiql: true }));
router.all("/playground", koaPlayground({ endpoint: "/graphql" }));

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export default app;
