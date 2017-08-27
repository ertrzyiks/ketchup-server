FROM node:6.9.3

ENV PORT 80

ADD ./CHECKS /app/CHECKS
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
COPY package.json package-lock.json /usr/src/app/
RUN npm i

COPY . /usr/src/app
RUN npm i
RUN npm run build

EXPOSE 80

CMD [ "npm", "run", "start:prod" ]
