# Use Node.js LTS version
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
FROM base AS dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies + drizzle-kit for migrations
RUN pnpm install --prod --frozen-lockfile && \
    pnpm add -D drizzle-kit

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Copy migration files and config for database migrations
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.js"]
