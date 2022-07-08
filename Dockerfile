# ---------------
# Install Dependencies
# ---------------
FROM node:16-buster-slim as deps

WORKDIR /lndboss

COPY package.json yarn.lock ./
RUN yarn install --network-timeout 1000000

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /lndboss

RUN apt-get update && apt-get install -y jq

COPY . .
RUN yarn build
RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

# ---------------
# Release App
# ---------------
FROM node:16-buster-slim as final

WORKDIR /lndboss

# Set environment to production
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Set lndboss directory
ARG BOS_DATA_PATH=$HOME"/.bosgui"
ENV BOS_DATA_PATH=${BOS_DATA_PATH}
RUN echo "BOS_DATA_PATH="${BOS_DATA_PATH}

# Create a new user and group
ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID

# Copy files from build
COPY --from=build /lndboss/package.json ./
COPY --from=build /lndboss/node_modules/ ./node_modules
COPY --from=build /lndboss/nest-cli.json ./
COPY --from=build /lndboss/next-env.d.ts ./
COPY --from=build /lndboss/src ./src
COPY --from=build /lndboss/dist/ ./dist

# Change ownership of files to use the new user
RUN chown -R $USER_ID:$GROUP_ID /lndboss/

# Switch to the new user
USER $USER_ID:$GROUP_ID

# Create required directories
# UID / GID 1000 is default for user `node` in the `node:latest` image, this
# way the process will run as a non-root user
RUN mkdir /home/node/.bosgui
RUN mkdir /home/node/.lnd
RUN touch .env

# Expose the port the app runs on
EXPOSE 8055

# Start the app
CMD [ "yarn", "start:prod" ]



# FROM node:16-buster-slim

# ARG USER_ID=1000
# ARG GROUP_ID=1000
# ENV USER_ID=$USER_ID
# ENV GROUP_ID=$GROUP_ID

# RUN apt-get update && apt-get install -y git

# RUN git clone https://github.com/niteshbalusu11/lndboss.git

# WORKDIR /lndboss

# RUN chown -R $USER_ID:$GROUP_ID /lndboss/

# USER $USER_ID:$GROUP_ID

# RUN mkdir /home/node/.bosgui
# RUN mkdir /home/node/.lnd
# RUN touch .env

# RUN yarn install --network-timeout 1000000
# RUN yarn build

# EXPOSE 8055

# CMD [ "yarn", "start:prod" ]
