# Use the official Node image as a parent image
FROM node:current-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Compile TypeScript to JavaScript
RUN npm run build:compile

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "run", "start:prod" ]
