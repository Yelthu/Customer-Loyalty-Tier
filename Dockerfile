# Use the official Node.js image as a parent image as same as Client Side (NextJs)
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container (if available)
#COPY package*.json ./

# Install dependencies in the container
#RUN npm cache clean --force && npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3030

# Specify the command to run on container start
CMD [ "node", "server.js"]