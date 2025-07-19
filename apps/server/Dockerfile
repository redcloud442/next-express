# apps/server/Dockerfile
FROM node:20

WORKDIR /app

# Install PNPM
RUN npm install -g pnpm@10.4.1

# Copy only necessary files
COPY . .

# Optional: ignore bad checksums for Prisma
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Install only dependencies for this app
RUN pnpm install --frozen-lockfile --filter ./apps/server...

# Generate Prisma client if needed
RUN pnpm --filter ./apps/server exec prisma generate

# Build the app
RUN pnpm --filter ./apps/server run build

# Start
CMD ["pnpm", "--filter", "./apps/server", "start"]
