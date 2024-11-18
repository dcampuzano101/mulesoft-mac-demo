import { NextResponse } from "next/server";
import { writeFile, mkdir, access, readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { fileName, audioData } = await request.json();

    // Convert the array back to Uint8Array
    const uint8Array = new Uint8Array(audioData);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads");
    await createDirIfNotExists(uploadsDir);

    // Save the file
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, uint8Array);

    // Send the file data to the transcription API
    const response = await fetch("http://localhost:8081/api/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        filePath,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Transcription API responded with status: ${response.status}`
      );
    }

    const transcriptionResult = await response.json();

    // Read the processed audio file - using transcriptionResult.outputDirectory directly
    // since it already contains the full path to the output.wav file
    const processedAudioBuffer = await readFile(
      transcriptionResult.outputDirectory
    );

    // Convert the buffer to base64
    const base64Audio = processedAudioBuffer.toString("base64");

    // Return the audio data as base64
    return NextResponse.json({
      success: true,
      outputDirectory: transcriptionResult.outputDirectory,
      audioData: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}
