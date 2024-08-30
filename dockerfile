# Use an official Node.js runtime as a parent image
FROM node:22.2.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm run clean

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run buildProd

COPY src/resources/application-prod.yaml src/resources/application.yaml

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "prod"]