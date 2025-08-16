# Use Node.js LTS
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# -------------------------
# Production image
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json and install only production deps
COPY package*.json ./
RUN npm install --only=production

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

# Expose NestJS port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
