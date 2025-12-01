import { defineFunction, secret } from "@aws-amplify/backend";

export const apiQuote = defineFunction({
  name: "api-quote",
  environment: {
    SUPABASE_URL: secret("SUPABASE_URL"),
  },
});
