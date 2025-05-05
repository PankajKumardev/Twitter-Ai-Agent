import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { createPost } from './twitterTool.js';
import { getUserTimeline } from './twitterTool.js';
import { getUserFollowers } from './twitterTool.js';
import { getUserFollowing } from './twitterTool.js';

const app = express();
app.use(express.json());

const server = new McpServer({
  name: 'example-server',
  version: '1.0.0',
});

function sanitizeToolName(name) {
  let sanitizedName = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  if (!/^[a-zA-Z_]/.test(sanitizedName)) {
    sanitizedName = '_' + sanitizedName;
  }
  if (sanitizedName.length > 64) {
    sanitizedName = sanitizedName.substring(0, 64);
  }
  return sanitizedName;
}

// server.tool(
//   sanitizeToolName('add two numbers'),
//   'Adds two numbers together',
//   {
//     a: z.number(),
//     b: z.number(),
//   },
//   async ({ a, b }) => {
//     return {
//       content: [
//         {
//           type: 'text',
//           text: `The sum of ${a} and ${b} is ${a + b}`,
//         },
//       ],
//     };
//   }
// );

server.tool(
  'createPost',
  'Create a post on Twitter',
  {
    status: z.string(),
  },
  async ({ arg }) => {
    const { status } = arg;
    return createPost(status);
  }
);

server.tool(
  'getUserTimeline',
  'Get user timeline',
  {
    username: z.string(),
  },
  async ({ arg }) => {
    const { username } = arg;
    return getUserTimeline(username);
  }
);

server.tool(
  'getUserFollowers',
  'Get user followers',
  {
    username: z.string(),
  },
  async ({ arg }) => {
    const { username } = arg;
    return getUserFollowers(username);
  }
);

server.tool(
  'getUserFollowing',
  'Get user following',
  {
    username: z.string(),
  },
  async ({ arg }) => {
    const { username } = arg;
    return getUserFollowing(username);
  }
);

app.post('/mcp', async (req, res) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.

  try {
    // Use the existing server instance instead of getServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/mcp', async (req, res) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    })
  );
});

app.delete('/mcp', async (req, res) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    })
  );
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
