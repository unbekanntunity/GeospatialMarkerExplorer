import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: {
    path: "./source/api/generated"
  },
  plugins: ["@hey-api/client-fetch"]
});
