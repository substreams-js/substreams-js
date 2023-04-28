# syntax=docker/dockerfile:1.4

FROM node:18-alpine3.17 AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.3.1 --activate
RUN pnpm add @fubhy/substreams-proxy

ENV PATH=/app/node_modules/.bin:$PATH

ENTRYPOINT ["substreams-proxy"]
