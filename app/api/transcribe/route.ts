import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Forward the audio file to the local transcription service
    const transcriptionResponse = await fetch(
      "http://localhost:8081/api/transcribe",
      {
        method: "POST",
        body: formData,
      }
    );

    // Add logging to see the raw response
    const rawResponse = await transcriptionResponse.text();
    console.log("Raw transcription response:", rawResponse);

    if (!transcriptionResponse.ok) {
      throw new Error(
        `Transcription service error: ${transcriptionResponse.statusText}. Response: ${rawResponse}`
      );
    }

    // Try parsing the response after logging it
    let transcriptionResult;
    try {
      transcriptionResult = JSON.parse(rawResponse);
    } catch (parseError: unknown) {
      throw new Error(
        `Failed to parse transcription response: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }. Raw response: ${rawResponse}`
      );
    }

    return NextResponse.json(transcriptionResult);
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
