# CDXM Marketplace

CDXM is a Codex plugin marketplace for small, focused extensions that make everyday work easier.

This repository is the source of truth for the marketplace and the plugins it publishes.

## Use this marketplace in Codex

Install plugins directly from this curated list by pointing Codex at the repository marketplace:

CLI:

```bash
codex plugin marketplace add lameen-k/cdxm --ref main
```

Confirm that Codex has registered the source:

```bash
codex plugin marketplace list
```

Then restart the ChatGPT desktop app, open the Plugins Directory, choose **CDXM**, and install the plugin you want to use.

## Available plugins

| Plugin                                          | What it does                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [CDXM Test Plugin](./plugins/cdxm-test-plugin/) | A safe greeting skill that verifies the marketplace is installed and discoverable in Codex. |
| [Tester One](./plugins/tester-one/)             | Opens a live, read-only browser for JSONPlaceholder API resources.                          |

## Try the included test plugin

1. Select **CDXM** from the Plugins Directory.
2. Install **CDXM Test Plugin**.
3. Ask Codex: `Run the CDXM marketplace test.`

Codex should reply: **“CDXM marketplace test plugin is installed and working.”**

## Repository layout

```text
.agents/plugins/marketplace.json   Marketplace catalog
plugins/                           Published plugin sources
```

Each plugin owns its own `.codex-plugin/plugin.json` manifest. The marketplace catalog points to plugin directories relative to the repository root.

## Contributing a plugin

1. Add the plugin under `plugins/<plugin-name>/`.
2. Include a valid `.codex-plugin/plugin.json` manifest.
3. Register the plugin in `.agents/plugins/marketplace.json`.
4. Validate the plugin before opening a pull request.

Keep plugins focused, safe by default, and clear about what they add to Codex.
