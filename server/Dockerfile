# Use a lighter version of Node as a parent image
FROM node:13.12.0-alpine
# Set the working directory to /api
WORKDIR /server
# copy package.json into the container at /api
COPY package*.json /server/
COPY .babelrc /server/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY ./server /server/server
# build lib
RUN npm run build_backend
# Make port 80 available to the world outside this container
EXPOSE 5000
# Run the app when the container launches
CMD ["npm", "run", "server"]