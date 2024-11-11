# develop stage
FROM node:18-alpine as develop-stage
ARG casino
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
ARG casino
RUN yarn
#RUN quasar build:$casino
RUN ENVIRONMENT=$casino quasar build

#production stage
FROM node:lts-alpine as production-stage
ARG casino
RUN echo "dist/$casino"
RUN echo "-----"
RUN echo $casino
RUN npm i -g serve
WORKDIR /app
COPY --from=build-stage /app/dist /app/dist
EXPOSE 8080

ENV dist /app/dist/$casino
RUN echo $dist
WORKDIR $dist

ENTRYPOINT ["serve", "-s","-p","8080"]

# production stage
#FROM nginx:1.17.5-alpine as production-stage
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
