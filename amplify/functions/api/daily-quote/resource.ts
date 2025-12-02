import { defineFunction, secret } from "@aws-amplify/backend";

export const apiDailyQuote = defineFunction({
  name: "api-daily-quote",
  environment: {
    SUPABASE_URL: secret("SUPABASE_URL"),
  },
});
