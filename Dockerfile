# Build stage
FROM node:20-alpine AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build:compile

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci

# Copy built application from the builder stage
COPY --from=builder /app/build ./build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ARG VERSION=latest
ENV VERSION=$VERSION

# Label the container
LABEL org.opencontainers.image.version=$VERSION

# Run the app when the container launches
CMD ["node", "build/src/index.js"]
