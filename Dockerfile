FROM node:16-alpine

ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID

RUN apk add --no-cache --upgrade bash
RUN apk add --no-cache git
# RUN apk add --no-cache curl

# RUN curl http://host.docker.internal:10009

RUN git clone https://github.com/niteshbalusu11/lndboss.git

WORKDIR /lndboss

RUN chown -R $USER_ID:$GROUP_ID /lndboss/

USER $USER_ID:$GROUP_ID

RUN mkdir /home/node/.bosgui
RUN yarn install
RUN yarn build

EXPOSE 8055

CMD [ "yarn", "start:prod" ]
