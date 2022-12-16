ARG POSITIONSTACK_API_KEY
FROM node:16 AS builder
ARG POSITIONSTACK_API_KEY

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ENV POSITIONSTACK_API_KEY ${POSITIONSTACK_API_KEY}

RUN npm run build

# Production image, copy all the files and run next
FROM node:16 AS runner
WORKDIR /app
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs


CMD ["node", "server.js"]
