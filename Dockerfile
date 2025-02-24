FROM node:lts AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

FROM deps AS dev
CMD ["npm", "run", "dev"]


FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts AS prod
ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=build /app/public ./public
# Automatically leverage output traces to reduce image size
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
