# PetAI Studio
<img width="1146" height="840" alt="demo" src="https://github.com/user-attachments/assets/75ed195e-40f0-4fce-9cab-c3e8bb9855ad" />

PetAI Studio is a web application that allows you to transform photos of your pets into works of art using artificial intelligence.

## Requirements

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Google Gemini API key for image generation
- OpenRouter API key for random style generation

## Installation and startup with Docker

### 1. Clone the repository

```bash
git clone <repository-url>
cd petai-studio
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:

```
GOOGLE_API_KEY=your_google_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-4-scout
```

You can copy the `.env.example` file and modify it:

```bash
cp .env.example .env
# Edit the .env file with your API keys
```

### 3. Build and start the application with Docker Compose

```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 4. View application logs

```bash
docker-compose logs -f
```

### 5. Stop the application

```bash
docker-compose down
```

## Advanced configuration

### Modify prompt prefix and suffix

The prompts for image generation are configurable by modifying the `PROMPT_PREFIX` and `PROMPT_SUFFIX` constants in the files:

- `app/page.tsx`
- `app/api/generate-style/route.ts`

### Optional environment variables

- `OPENROUTER_MODEL`: OpenRouter model to use (default: `deepseek/deepseek-chat-v3.1`)
- `PORT`: Port on which the application will listen (default: `3000`)
- `HOSTNAME`: Hostname on which the application will listen (default: `0.0.0.0`)

## Production deployment

For production deployment, make sure to:

1. Use HTTPS to protect API keys and user data.
2. Properly configure environment variables in your hosting environment. The `HTTP-Referer` header required by some APIs (like OpenRouter) is set automatically by a middleware.
3. For best results in production, it is recommended to set the `APP_URL` environment variable to your application's public domain (e.g., `APP_URL=https://your-app-domain.com`). If not set, the system will attempt to infer it from request headers.

## Obtaining API keys

### Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an account or sign in with your Google account
3. Create a new API key

### OpenRouter API

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account or sign in
3. Go to the API keys section and create a new API key
