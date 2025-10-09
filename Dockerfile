# Base image
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS dev
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create .next directory with proper permissions
RUN mkdir -p .next && chown -R node:node .next

# Expose port
EXPOSE 3000

# Set environment variables for better performance
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start development server with optimized settings
CMD ["pnpm", "run", "dev:light"]
