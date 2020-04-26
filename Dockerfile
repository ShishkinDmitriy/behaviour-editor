FROM node:10.12.0

ARG VERSION=SNAPSHOT

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

ENTRYPOINT ["node", "__sapper__/build"]
