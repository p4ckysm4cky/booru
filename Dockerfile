# Build site.
FROM node:16-alpine AS builder
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
FROM node:16-alpine
WORKDIR /app

COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
COPY --from=builder /build/migrations ./migrations

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

ENTRYPOINT ["/bin/sh", "-c" , "node ./migrations/migrate.js && node server.js -p $PORT"]
