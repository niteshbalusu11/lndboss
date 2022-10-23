# ---------------
# Install Dependencies
# ---------------
FROM node:16-alpine as build

WORKDIR /lndboss

COPY package.json yarn.lock ./
RUN yarn install --network-timeout 1000000

# ---------------
# Build App
# ---------------

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build:prod

# ---------------
# Install Production Dependencies
# ---------------

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

# Copy files from build
COPY --from=build /lndboss/package.json ./
COPY --from=deps /lndboss/node_modules/ ./node_modules

# Copy NestJS files from build
COPY --from=build /lndboss/nest-cli.json ./
COPY --from=build /lndboss/dist/ ./dist

# Copy NextJS files from build
COPY --from=build /lndboss/next-env.d.ts ./
COPY --from=build /lndboss/src/client/.next ./src/client/.next
COPY --from=build /lndboss/src/client/public ./src/client/public
COPY --from=build /lndboss/src/client/next-env.d.ts ./src/client/next-env.d.ts
COPY --from=build /lndboss/src/client/next.config.js ./src/client/next.config.js

# Expose the port the app runs on
EXPOSE 8055

# Start the app
CMD [ "yarn", "start:prod" ]
