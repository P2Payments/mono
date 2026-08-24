// ponytail: single-instance in-memory dedup so MassPay's webhook retries don't
// trigger duplicate sweeps. Move to shared storage (KV/DB) if this rail ever
// runs as more than one instance.
const seen = new Set()

export const alreadyProcessed = (id) => seen.has(id)

export const markProcessed = (id) => {
  seen.add(id)
  if (seen.size > 1000) {
    seen.delete(seen.values().next().value)
  }
}
