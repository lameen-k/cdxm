---
name: jsonplaceholder-resource-browser
description: Browse and inspect JSONPlaceholder API resources through a live local UI.
---

# JSONPlaceholder Resource Browser

Use this skill when the user asks to browse, inspect, search, or visualize JSONPlaceholder resources such as posts, comments, albums, photos, todos, or users.

1. Start the browser from the plugin root:

   ```bash
   node scripts/serve-resource-browser.mjs
   ```

2. Open the localhost URL printed by the script.
3. Use the route selector to choose a resource and the search box to filter the loaded records.
4. Select a record to show its complete JSON payload.

The UI reads from `https://jsonplaceholder.typicode.com` in the browser. It is read-only and never sends mutations to the API.
