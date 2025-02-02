# OpenSeek

A Next.js application that provides an interface to interact with DeepSeek AI through Russian translation. Messages are translated to Russian, processed by DeepSeek, and translated back to English.

## Features

- Modern, responsive UI
- Real-time message updates
- Automatic translation flow (English → Russian → DeepSeek → Russian → English)
- Detailed console logging of translations
- Dark mode interface

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd openseek
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (used for translations)
- `DEEPSEEK_API_KEY`: Your DeepSeek API key (used for AI responses)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API (for translations)
- Groq SDK (for DeepSeek integration)

## Development

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## License

MIT 