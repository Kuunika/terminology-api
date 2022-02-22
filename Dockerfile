FROM node:12 as building
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY ./ ./
RUN npm run build

FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=building /usr/src/app/package*.json ./
RUN npm install --only=prod
COPY --from=building /usr/src/app/dist /usr/src/app/dist
EXPOSE 3000
CMD [ "node", "dist/main.js" ]