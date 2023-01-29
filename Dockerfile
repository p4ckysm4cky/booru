# Build site.
FROM node:18-alpine AS builder
WORKDIR /build

ADD ./package.json ./package-lock.json ./
RUN npm ci

ARG NEXT_PUBLIC_NO_INDEX

ADD ./tsconfig.json ./.eslintrc.json ./next.config.js ./
ADD ./migrations ./migrations
ADD ./pages ./pages
ADD ./public ./public
ADD ./server ./server
RUN npm run build

# Serve site.
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
COPY --from=builder /build/migrations ./migrations


ENTRYPOINT ["/bin/sh", "-c" , "node ./migrations/migrate.js && node server.js -p $PORT"]
