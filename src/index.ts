#!/usr/bin/env node
/**
 * All API endpoints support both JSON and Markdown response formats.
 * Set the "format" parameter to "json" or "markdown" (default is "markdown").
 * - Use "markdown" for human-readable output when only reading content
 * - Use "json" when you need to process or modify the data programmatically
 *
 * Command-line Arguments:
 * --enabledTools: Comma-separated list of tools to enable (e.g. "notion_retrieve_page,notion_query_database")
 *
 * Environment Variables:
 * - NOTION_API_TOKEN: Required. Your Notion API integration token.
 * - NOTION_MARKDOWN_CONVERSION: Optional. Set to "true" to enable
 *   experimental Markdown conversion. If not set or set to any other value,
 *   all responses will be in JSON format regardless of the "format" parameter.
 */
import { startServer } from "./server/index.js";

// Parse command line arguments
const enabledToolsSet = new Set([
  "notion_retrieve_block",
  "notion_retrieve_block_children",
  "notion_retrieve_page",
  "notion_query_database",
  "notion_retrieve_database",
  "notion_search",
  "notion_list_all_users",
  "notion_retrieve_user",
  "notion_retrieve_bot_user",
  "notion_retrieve_comments",
]);

// if test environment, do not execute main()
if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
}

async function main() {
  const notionToken = process.env.NOTION_API_TOKEN;
  const enableMarkdownConversion =
    process.env.NOTION_MARKDOWN_CONVERSION === "true";

  if (!notionToken) {
    console.error("Please set NOTION_API_TOKEN environment variable");
    process.exit(1);
  }

  await startServer(notionToken, enabledToolsSet, enableMarkdownConversion);
}
