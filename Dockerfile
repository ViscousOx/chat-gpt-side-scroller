# Stage 1: Build the application
FROM node:lts

WORKDIR /app

# Copy the built application from the builder stage
COPY package*.json ./
COPY . .

# Install only production dependencies
RUN npm install

# Expose the desired port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
