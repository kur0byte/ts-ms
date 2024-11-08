# Build stage
FROM node:20-alpine AS builder

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build:compile

# Production stage
FROM node:20-alpine

# Install Python and other runtime dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod

# Copy built application from the builder stage
COPY --from=builder /app/build ./build

# Make port 4500 available to the world outside this container
EXPOSE 4500

# Define environment variable
ARG VERSION=latest
ENV VERSION=$VERSION

# Label the container
LABEL org.opencontainers.image.version=$VERSION

# Run the app when the container launches
CMD ["node", "build/src/main.js"]
