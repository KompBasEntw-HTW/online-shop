ARG POSITIONSTACK_API_KEY
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG KEYCLOAK_NEXTAUTH_CLIENT_ID
ARG KEYCLOAK_NEXTAUTH_CLIENT_SECRET
FROM node:lts AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:lts AS runner
ARG POSITIONSTACK_API_KEY
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG KEYCLOAK_NEXTAUTH_CLIENT_ID
ARG KEYCLOAK_NEXTAUTH_CLIENT_SECRET

ENV POSITIONSTACK_API_KEY ${POSITIONSTACK_API_KEY}

ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}

ENV KEYCLOAK_NEXTAUTH_CLIENT_ID ${KEYCLOAK_NEXTAUTH_CLIENT_ID}
ENV KEYCLOAK_NEXTAUTH_CLIENT_SECRET ${KEYCLOAK_NEXTAUTH_CLIENT_SECRET}

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs


CMD ["node", "server.js"]
