import { config } from 'dotenv';
import readline from 'readline/promises';
import { GoogleGenAI } from '@google/genai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: '',
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
  .connect(new StreamableHTTPClientTransport(new URL('http://localhost:3001/mcp')))
  .then(async () => {
    console.log('Connected to Model Context Protocol server.');
    const tools = (await mcpClient.listTools()).tools;
    console.log('Available tools:', tools);
  });

  