FROM node:alpine as build-stage
WORKDIR /app
COPY . /app
RUN npm install && npx -w server prisma generate && npm run build

FROM node:alpine as run-stage
WORKDIR /app
COPY ./server /app
COPY --from=build-stage /app/app/dist/spa /app/dist/public
RUN npm install --only=production && npx prisma generate
CMD ["npm", "run", "docker"]
