import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Here you would implement your backend logic
    // For example, sending to your backend system
    // const response = await fetch('YOUR_BACKEND_URL', {
    //   method: 'POST',
    //   body: formData,
    // });

    return NextResponse.json({ message: "Audio processed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
