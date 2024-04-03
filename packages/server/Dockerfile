FROM oven/bun:1-slim
WORKDIR /usr/src/app

COPY . .
RUN bun install

ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
