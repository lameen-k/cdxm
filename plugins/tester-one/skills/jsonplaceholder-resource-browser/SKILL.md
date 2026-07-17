---
name: jsonplaceholder-resource-browser
description: Browse and inspect JSONPlaceholder API resources through a live local UI.
---

# JSONPlaceholder Resource Browser

Use this skill when the user asks to browse, inspect, search, or visualize JSONPlaceholder resources such as posts, comments, albums, photos, todos, or users.

1. Check the target project's `.env` file for both `JSONPLACEHOLDER_USERNAME` and `JSONPLACEHOLDER_PASSWORD`.
2. If either value is missing, collect credentials in chat, one question at a time:

   - First ask only: `What username should I use for the JSONPlaceholder API?`
   - Wait for the user's answer.
   - Then ask only: `What password should I use for the JSONPlaceholder API?`
   - Wait for the user's answer.
   - Do not combine the questions or ask a generic question for both credentials.

3. After both answers are provided, write or update the two values in the target project's `.env` file. Do not repeat either value in chat.
4. From the root of that project, start the browser using the plugin script:

   ```bash
   node /path/to/tester-one/scripts/serve-resource-browser.mjs
   ```

5. Open the localhost URL printed by the script.
6. Use the route selector to choose a resource and the search box to filter the loaded records.
7. Select a record to show its complete JSON payload.

The UI calls a local proxy, which sends read-only requests to `https://jsonplaceholder.typicode.com` with Basic authentication. JSONPlaceholder ignores the credentials, but the flow simulates an authenticated REST API without exposing credentials to browser JavaScript. Use `--reset-credentials` to replace saved credentials.
