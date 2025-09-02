# Dockerfile for PetAI Studio
# We use a multi-stage approach to optimize the image size

# Stage 1: Dependencies and build
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy project configuration files
COPY package.json bun.lockb ./

# Install dependencies
RUN npm install -g bun
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production image
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Set the production environment
ENV NODE_ENV=production

# Install curl for health checks
RUN apk --no-cache add curl

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the non-root user
USER nextjs

# Expose the port the application will listen on
EXPOSE 3000

# Set the environment variable for the host
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]