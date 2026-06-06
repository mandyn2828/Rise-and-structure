# Use a Node.js base image
FROM node:20-slim AS base

# Install build dependencies for better-sqlite3 (native modules)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt-get/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create database directory if it doesn't exist
RUN mkdir -p database

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Expose the port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
