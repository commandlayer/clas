# CLAS and MCP Compatibility

CLAS is designed to work naturally with Model Context Protocol (MCP) integrations.

## Discovery and schema resolution

MCP tools can discover available actions and map them to CLAS family manifests and verb schemas.

## `get_action_schema`

An MCP server implementing `get_action_schema` can return canonical CLAS schema objects — specifically the `<verb>.request.schema.json` and `<verb>.receipt.schema.json` for a given verb — so clients receive a standard contract.

## `verify_receipt`

An MCP server implementing `verify_receipt` can transport verification requests and results, but it is not the trust root; trust validation is performed by runtime/verifyagent against CLAS receipt contracts.

## Trust model

The MCP server is a bridge for access and transport. It is not the trust root. Trust comes from verifiable receipts and signer identity.
