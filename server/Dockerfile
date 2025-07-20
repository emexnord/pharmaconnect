ARG IMAGE=node:24-alpine

# -------- Common --------
FROM $IMAGE AS builder
WORKDIR /app
COPY . .
RUN npm install

# -------- Development --------
FROM builder AS dev
CMD []

# -------- Prod Middle Step --------
FROM builder AS prod-build
RUN npm run build
RUN npm prune --production

# -------- Production --------
FROM $IMAGE AS prod
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
# COPY --chown=node:node --from=prod-build /app/.env /app/.env

ENV NODE_ENV=production
ENTRYPOINT [ "node", "./dist/main.js" ]
WORKDIR /app/dist
CMD [""]

USER node
