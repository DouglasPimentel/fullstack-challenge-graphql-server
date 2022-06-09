import fs from "fs";
import path from "path";
import { promisify } from "util";
import { graphql, GraphQLSchema } from "graphql";
import { printSchema, getIntrospectionQuery } from "graphql/utilities";
import schema from "../src/graphql/schema";

const writeFileAsync = promisify(fs.writeFile);
const introspectionQuery = getIntrospectionQuery();

const generateSchema = async (
  schemaGraphQL: GraphQLSchema,
  relativePath: string
) => {
  const result = await graphql({
    schema: schemaGraphQL,
    source: introspectionQuery,
  });

  if (result.errors) {
    console.error(JSON.stringify(result.errors, null, 2));
  } else {
    await writeFileAsync(
      path.join(__dirname, `${relativePath}/schema.json`),
      JSON.stringify(result, null, 2)
    );
  }
};

(async () => {
  const configs = [
    {
      schema: schema,
      path: "../schemas/graphql",
    },
  ];

  await Promise.all([
    ...configs.map(async (config) => {
      await generateSchema(config.schema, config.path);
    }),
    ...configs.map(async (config) => {
      await writeFileAsync(
        path.join(__dirname, `${config.path}/schema.graphql`),
        printSchema(config.schema)
      );
    }),
  ]);

  process.exit(0);
})();
