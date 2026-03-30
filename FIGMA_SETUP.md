Configure the Figma MCP server in `C:\Project\siteportfolio\figma.mcp.json`.

Expected format:

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp",
      "type": "http"
    }
  }
}
```

Notes:
- Main file for this project: `figma.mcp.json`
- This local URL is served by the Figma desktop app, so Figma must be running.
- Do not put a raw API token in `Authorization` for the MCP server config.
- If local MCP is unavailable, fall back to the remote MCP server and its client sign-in flow.
