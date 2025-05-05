# AI Twitter Agent 🤖🐦

An AI-powered agent built with MCP Framework and **Twitter API v2**, using **Node.js**.  
This tool allows you to automate intelligent and human-like tweets, from motivational content to humor and sarcasm.

---

## 🚀 Features

- **Post any status** using the `createPost` tool
- **Generate funny tweets** with `createFunnyPost`
- **Share motivational thoughts** with `createMotivationalPost`
- **Post sarcastic commentary** with `createSarcasticPost`
- Built with a **simple, extensible architecture** for adding more tools easily

---

## 🛠 Tools

| Tool Name             | Description                                 |
|----------------------|---------------------------------------------|
| `createPost`         | Post a regular tweet with custom text       |
| `createFunnyPost`    | Generate a tweet with humorous tone         |
| `createMotivationalPost` | Create motivational and inspiring content |
| `createSarcasticPost`| Add a sarcastic twist to any topic          |

---

## ⚙️ Tech Stack

- Nodejs
- MCP Framework
- Twitter api v2

---

## 📦 Setup

1. **Clone the repo**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**

```bash
cd client
```

```bash
npm install 
```

```bash
cd server
```

```bash
npm install 
```

3. **Create a `.env` file** with your Twitter API credentials in the server:

```
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_TOKEN_SECRET=your_token_secret
```

4. **Run the client and server**

```bash
node index.js
```

---

## 📌 Notes

- Rate limits depend on your Twitter App tier.
- Designed for developers, social bots, and AI agent experimentation.

---

Made with ❤️ using MCP and Node.js
