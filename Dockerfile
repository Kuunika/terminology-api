FROM node:12 as building
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --only=prod
COPY ./dist .

FROM node:12-alpine
CMD tail -f /dev/null
COPY --from=building /usr/src/app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3001
CMD [ "node", "main.js" ]