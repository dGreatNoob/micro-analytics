# MCP (Model Context Protocol) Setup Guide

## Overview

MCP (Model Context Protocol) allows Cursor to interact with external tools and services through a standardized protocol. This setup provides your Microlytics project with enhanced capabilities for filesystem access, database operations, and sequential thinking.

## Configuration Files

### Global Configuration
- **Location**: `~/.config/Cursor/User/globalStorage/kilocode.kilo-code/settings/mcp_settings.json`
- **Purpose**: Global MCP server configuration for all Cursor projects

### Local Configuration  
- **Location**: `.mcp/config.json`
- **Purpose**: Project-specific MCP configuration

## Configured MCP Servers

### 1. Filesystem Server
- **Package**: `@modelcontextprotocol/server-filesystem`
- **Purpose**: Provides filesystem access within your project directory
- **Path**: `/home/biiieem/repos/micro-analytics`

### 2. Sequential Thinking Server
- **Package**: `@modelcontextprotocol/server-sequential-thinking`
- **Purpose**: Enables structured problem-solving and reasoning
- **Status**: ✅ Available

### 3. Enhanced PostgreSQL Server
- **Package**: `enhanced-postgres-mcp-server`
- **Purpose**: Database operations for your Prisma/PostgreSQL setup
- **Connection**: `postgresql://postgres:password@localhost:5432/microlytics`

## Setup Instructions

1. **Run the setup script**:
   ```bash
   ./setup-mcp.sh
   ```

2. **Restart Cursor** to load the new MCP configuration

3. **Verify MCP is working**:
   - Open a new chat in Cursor
   - Look for MCP server indicators in the interface
   - Try using MCP-enabled features

## Troubleshooting

### Common Issues

#### "MCP server may need to be installed"
- **Solution**: The server will be downloaded automatically when first used via `npx`
- **Alternative**: Install globally with `npm install -g <package-name>`

#### Permission Errors
- **Solution**: Use `npx` instead of global installation to avoid permission issues

#### Database Connection Issues
- **Check**: Ensure PostgreSQL is running on `localhost:5432`
- **Verify**: Database credentials in the connection string
- **Test**: Connection with `psql postgresql://postgres:password@localhost:5432/microlytics`

### Manual Installation

If automatic installation fails, install MCP servers manually:

```bash
# Install filesystem server
npm install -g @modelcontextprotocol/server-filesystem

# Install sequential thinking server  
npm install -g @modelcontextprotocol/server-sequential-thinking

# Install enhanced postgres server
npm install -g enhanced-postgres-mcp-server
```

## Usage Examples

### Filesystem Operations
- Browse and read project files
- Navigate directory structures
- Access documentation and code

### Database Operations
- Query your Microlytics database
- Inspect table structures
- Run analytics queries

### Sequential Thinking
- Break down complex problems
- Structured reasoning processes
- Step-by-step analysis

## Security Considerations

- MCP servers run with the same permissions as your user account
- Filesystem access is limited to your project directory
- Database credentials are stored in environment variables
- No sensitive data should be logged by MCP servers

## Support

If you encounter issues:

1. Check the MCP logs in Cursor's developer console
2. Verify server availability with `npx <package-name> --help`
3. Restart Cursor and try again
4. Check this documentation for troubleshooting steps

## Updates

To update MCP servers:

```bash
# Update all MCP servers
npm update -g @modelcontextprotocol/server-filesystem
npm update -g @modelcontextprotocol/server-sequential-thinking  
npm update -g enhanced-postgres-mcp-server
```

---

*This setup is optimized for the Microlytics project development workflow.*




