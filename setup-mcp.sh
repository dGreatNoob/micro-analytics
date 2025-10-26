#!/bin/bash

# MCP Setup Script for Microlytics Project
# This script helps set up MCP (Model Context Protocol) servers for your project

echo "🔧 Setting up MCP Configuration for Microlytics..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Create a local MCP configuration directory
mkdir -p .mcp

# Create a simple MCP server configuration
cat > .mcp/config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/home/biiieem/repos/micro-analytics"],
      "env": {}
    },
    "sequential-thinking": {
      "command": "npx", 
      "args": ["@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "enhanced-postgres": {
      "command": "npx",
      "args": ["enhanced-postgres-mcp-server"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:password@localhost:5432/microlytics"
      }
    }
  }
}
EOF

echo "✅ Created local MCP configuration at .mcp/config.json"

# Test if the MCP servers can be run
echo "🧪 Testing MCP server availability..."

# Test filesystem server
if npx @modelcontextprotocol/server-filesystem --help &> /dev/null; then
    echo "✅ Filesystem MCP server is available"
else
    echo "⚠️  Filesystem MCP server may need to be installed"
fi

# Test sequential thinking server
if npx @modelcontextprotocol/server-sequential-thinking --help &> /dev/null; then
    echo "✅ Sequential thinking MCP server is available"
else
    echo "⚠️  Sequential thinking MCP server may need to be installed"
fi

# Test enhanced postgres server
if npx enhanced-postgres-mcp-server --help &> /dev/null; then
    echo "✅ Enhanced PostgreSQL MCP server is available"
else
    echo "⚠️  Enhanced PostgreSQL MCP server may need to be installed"
fi

echo ""
echo "🎉 MCP setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart Cursor to load the new MCP configuration"
echo "2. The MCP servers will be available in your Cursor chat interface"
echo "3. You can use them to interact with your filesystem, database, and for sequential thinking"
echo ""
echo "📁 Configuration files:"
echo "- Global: ~/.config/Cursor/User/globalStorage/kilocode.kilo-code/settings/mcp_settings.json"
echo "- Local: .mcp/config.json"
echo ""
echo "🔍 To verify MCP is working:"
echo "- Open Cursor"
echo "- Start a new chat"
echo "- Look for MCP server indicators in the chat interface"




