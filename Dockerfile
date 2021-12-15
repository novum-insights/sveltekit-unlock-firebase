FROM node:16-alpine AS build

RUN mkdir -p /app

WORKDIR /app

COPY . .
RUN yarn install

# EXPOSE 80/tcp
EXPOSE 3000


# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

RUN yarn build

CMD yarn start
