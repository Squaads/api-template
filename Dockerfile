FROM node:10-alpine 
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app
RUN apk --no-cache add python make g++
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev"]