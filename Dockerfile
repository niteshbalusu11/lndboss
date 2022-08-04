# ---------------
# Install Dependencies
# ---------------
FROM amd64/node:16-alpine as build

WORKDIR /lndboss

COPY package.json yarn.lock ./
RUN yarn install --network-timeout 1000000

# ---------------
# Build App
# ---------------

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build:prod

FROM node:16-alpine as deps

WORKDIR /lndboss

COPY package.json yarn.lock ./

RUN yarn install --production --network-timeout 1000000

# ---------------
# Release App
# ---------------
FROM node:16-alpine as final

WORKDIR /lndboss

# Set environment to production
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Create a new user and group
ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID

RUN touch .env
RUN chown -R $USER_ID:$GROUP_ID /lndboss/

# Copy files from build
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/package.json ./
COPY --from=deps --chown=$USER_ID:$GROUP_ID /lndboss/node_modules/ ./node_modules

# Copy NestJS files from build
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/nest-cli.json ./
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/dist/ ./dist

# Copy NextJS files from build
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/next-env.d.ts ./
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/src/client/.next ./src/client/.next
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/src/client/public ./src/client/public
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/src/client/next-env.d.ts ./src/client/next-env.d.ts
COPY --from=build --chown=$USER_ID:$GROUP_ID /lndboss/src/client/next.config.js ./src/client/next.config.js

# Switch to the new user
USER $USER_ID:$GROUP_ID

# Create required directories
# UID / GID 1000 is default for user `node` in the `node:latest` image, this
# way the process will run as a non-root user
RUN mkdir /home/node/.bosgui
RUN mkdir /home/node/.lnd

# Expose the port the app runs on
EXPOSE 8055

# Start the app
CMD [ "yarn", "start:prod" ]
