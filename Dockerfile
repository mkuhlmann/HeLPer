FROM node:alpine as build-stage
WORKDIR /app
COPY . /app
RUN npm install && npm run build

FROM node:alpine as run-stage
WORKDIR /app
COPY ./server /app
COPY --from=build-stage /app/app/dist/spa /app/dist/public
RUN npm install --only=production
CMD ["npm", "run", "docker"]
