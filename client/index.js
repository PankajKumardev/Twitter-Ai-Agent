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
      // Sanitize tool name to conform to Google GenAI function name rules
      let sanitizedName = tool.name
        .replace(/[^a-zA-Z0-9_.-]/g, '_'); // replace invalid chars with underscore
      if (!/^[a-zA-Z_]/.test(sanitizedName)) {
        sanitizedName = '_' + sanitizedName; // prepend underscore if first char invalid
      }
      // if (sanitizedName.length > 64) {
      //   sanitizedName = sanitizedName.substring(0, 64); // truncate to 64 chars
      // }
      return {
        name: sanitizedName,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      };
    });

    // Start the chat loop after connection and tools are ready
    chatLoop();
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
  } else {
    const question = await rl.question('You: ');
    chatHistory.push({
      role: 'user',
      parts: [
        {
          text: question,
          type: 'text',
        },
      ],
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: chatHistory,
    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  });

  const functionCall = response.candidates[0].content.parts[0].functionCall;
  const responseText = response.candidates[0].content.parts[0].text;

  if (functionCall) {
    return chatLoop(functionCall);
  }

  chatHistory.push({
    role: 'model',
    parts: [
      {
        text: responseText,
        type: 'text',
      },
    ],
  });

  console.log(`AI: ${responseText}`);

  chatLoop();
}
