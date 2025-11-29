import { defineFunction, secret } from "@aws-amplify/backend";

export const apiTags = defineFunction({
  name: "api-tags",
  environment: {
    SUPABASE_URL: secret("SUPABASE_URL"),
  },
});
