export async function POST() {
  // Mock: in a real app you'd stream audio to a speech model.
  return Response.json({
    transcript: "[mock] Voice-to-Text is active. Example: 'Rotate B. Planting. Watch flank.'",
  })
}
