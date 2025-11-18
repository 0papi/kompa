import { env } from "@/config/env"
import { Client } from "@upstash/qstash"

export const qstashClient = new Client({
  token: env.NODE_ENV === "development" ? "eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0= ": env.QSTASH_TOKEN,
  baseUrl: env.NODE_ENV === "development" ? "http://localhost:8080" : undefined
})
