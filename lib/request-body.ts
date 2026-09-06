export async function readContactBody(request: Request): Promise<unknown> {
  const maxBytes = 16384;
  if (Number(request.headers.get("content-length")) > maxBytes)
    throw new Error("tooLarge");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("tooLarge");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
