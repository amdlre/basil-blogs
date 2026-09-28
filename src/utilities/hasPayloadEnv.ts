// Some hosts (e.g. Cranl) build the Docker image without the runtime env vars,
// so Payload can't connect during `next build`. When that happens we skip
// prerendering and render pages on request instead, once the env is available.
export const hasPayloadEnv = Boolean(process.env.DATABASE_URL && process.env.PAYLOAD_SECRET)
