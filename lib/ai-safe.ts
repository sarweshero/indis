import { generateObject, generateText } from "ai"

function toErrorMessage(err: unknown) {
  if (!err) return "unknown"
  if (typeof err === "string") return err
  if (typeof err === "object" && err && "message" in err) return String((err as any).message)
  try {
    return JSON.stringify(err)
  } catch {
    return "unknown"
  }
}

export async function safeGenerateText(opts: {
  model?: string
  prompt: string
  maxOutputTokens?: number
  temperature?: number
  fallbackText: string
}) {
  try {
    const { text } = await generateText({
      model: opts.model ?? "xai/grok-4",
      prompt: opts.prompt,
      maxOutputTokens: opts.maxOutputTokens,
      temperature: opts.temperature,
    })
    return { text, fallback: false as const }
  } catch (err) {
    return { text: opts.fallbackText, fallback: true as const, error: toErrorMessage(err) }
  }
}

export async function safeGenerateObject<T>(opts: {
  model?: string
  schema: any
  prompt: string
  maxOutputTokens?: number
  fallbackObject: T
}) {
  try {
    const { object } = await generateObject({
      model: opts.model ?? "xai/grok-4",
      schema: opts.schema,
      prompt: opts.prompt,
      maxOutputTokens: opts.maxOutputTokens,
    })
    return { object: object as T, fallback: false as const }
  } catch (err) {
    return { object: opts.fallbackObject as T, fallback: true as const, error: toErrorMessage(err) }
  }
}
