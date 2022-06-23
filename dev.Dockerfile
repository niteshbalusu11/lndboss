FROM node:16-buster-slim

ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID

WORKDIR /lndboss

COPY . .

RUN chown -R $USER_ID:$GROUP_ID /lndboss/

USER $USER_ID:$GROUP_ID

RUN mkdir /home/node/.bosgui
RUN mkdir /home/node/.lnd
RUN touch .env
RUN yarn install --network-timeout 1000000
RUN yarn build

EXPOSE 8055

CMD [ "yarn", "dev" ]
