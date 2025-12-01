import { defineFunction, secret } from "@aws-amplify/backend";

export const apiRandom = defineFunction({
  name: "api-random",
  environment: {
    SUPABASE_URL: secret("SUPABASE_URL"),
  },
});
