---
name: jsonplaceholder-resource-browser
description: Browse and inspect JSONPlaceholder API resources through a live local UI.
---

# JSONPlaceholder Resource Browser

Use this skill when the user asks to browse, inspect, search, or visualize JSONPlaceholder resources such as posts, comments, albums, photos, todos, or users.

1. From the root of the project where the credentials should be stored, start the browser using the plugin script:

   ```bash
   node /path/to/tester-one/scripts/serve-resource-browser.mjs
   ```

2. On first use, enter the requested username and password. The script saves them as `JSONPLACEHOLDER_USERNAME` and `JSONPLACEHOLDER_PASSWORD` in that project's `.env` file.
3. Open the localhost URL printed by the script.
4. Use the route selector to choose a resource and the search box to filter the loaded records.
5. Select a record to show its complete JSON payload.

The UI calls a local proxy, which sends read-only requests to `https://jsonplaceholder.typicode.com` with Basic authentication. JSONPlaceholder ignores the credentials, but the flow simulates an authenticated REST API without exposing credentials to browser JavaScript. Use `--reset-credentials` to replace saved credentials.
