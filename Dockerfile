# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 8080

# Start your app (replace server.js with your actual entry point)
CMD ["node", "server.js"]
