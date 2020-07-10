# To Create a new image
# docker build -t yusufameri/cah:<version_num> .

# To Push a new image
# docker push yusufameri/cah:<version num here optional>
####-------####-------####-------####-------####-------####-------####-------
FROM node:10

# # Create app directory for express server
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# npm i and build react build (production)
RUN mkdir -p  /usr/src/app/client/build
WORKDIR /usr/src/app/client
COPY build /usr/src/app/client/build

# go back to server and run it
WORKDIR /usr/src/app
CMD npm run server

# run server on port 5000
EXPOSE 8000
