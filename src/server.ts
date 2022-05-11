import { createServer } from "http";
import app from "./app";
import { config } from "./config";

(() => {
  const server = createServer(app.callback());

  server.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}/graphql`);
  });
})();
