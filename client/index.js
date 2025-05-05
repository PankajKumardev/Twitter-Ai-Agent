import { config } from 'dotenv';
import readline from 'readline/promises';
import { GoogleGenAI } from '@google/genai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

config();

let tools = [];

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const mcpClient = new Client({
  name: 'example-client',
  version: '1.0.0',
});
const chatHistory = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

mcpClient
  .connect(
    new StreamableHTTPClientTransport(new URL('http://localhost:3001/mcp'))
  )
  .then(async () => {
    console.log('connected to mcp server');

    tools = (await mcpClient.listTools()).tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      };
    });
  });

async function chatLoop(toolCall) {
  if (toolCall) {
    console.log('calling tool:', toolCall.name);

    chatHistory.push({
      role: 'model',
      parts: [
        {
          text: `calling tool: ${toolCall.name}`,
          type: 'text',
        },
      ],
    });

    const toolResult = await mcpClient.callTool({
      name: toolCall.name,
      arguments: toolCall.args,
    });

    chatHistory.push({
      role: 'user',
      parts: [
        {
          text: 'Tool result : ' + toolResult.content[0].text,
          type: 'text',
        },
      ],
    });
  }
}
