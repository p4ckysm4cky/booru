FROM node:16-alpine
ADD ./package.json ./package-lock.json ./
RUN npm install

ADD ./tsconfig.json ./.eslintrc.json ./next.config.js ./
ADD ./migrations ./migrations
ADD ./pages ./pages
ADD ./public ./public
ADD ./server ./server
RUN npm run build

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

ENTRYPOINT ["/bin/sh", "-c" , "npm run migrate && npx next start -p $PORT"]
