FROM node:16-buster-slim

ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID

RUN apt-get update && apt-get install -y git jq

RUN git clone https://github.com/niteshbalusu11/lndboss.git

WORKDIR /lndboss

RUN chown -R $USER_ID:$GROUP_ID /lndboss/

USER $USER_ID:$GROUP_ID

RUN mkdir /home/node/.bosgui
RUN mkdir /home/node/.lnd
RUN yarn install --network-timeout 1000000
RUN yarn build

EXPOSE 8055

CMD [ "yarn", "start:prod" ]
