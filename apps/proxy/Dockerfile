# syntax=docker/dockerfile:1.4

ARG VERSION=0.1.1

FROM node:20-alpine3.17 AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.5.1 --activate
RUN pnpm add @substreams/proxy@$VERSION

ENV PATH=/app/node_modules/.bin:$PATH

ENTRYPOINT ["substreams-proxy"]
