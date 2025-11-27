import { defineFunction, secret } from "@aws-amplify/backend";

export const myApiFunction = defineFunction({
  name: "api-function",
  environment: {
    SUPABASE_URL: secret("SUPABASE_URL"),
    SUPABASE_SERVICE_KEY: secret("SUPABASE_SERVICE_KEY"),
  },
});
