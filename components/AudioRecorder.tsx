"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useRecorderPermission } from "@/hooks/useRecorderPermission";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  type: "user" | "agent";
  audioUrl?: string;
  timestamp: Date;
  status: "processing" | "completed" | "error";
  outputDirectory?: string;
}

export default function AudioRecorder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isRecording, startRecording, stopRecording, recordingTime } =
    useRecorderPermission();

  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.type === "agent" &&
      lastMessage?.status === "completed" &&
      lastMessage?.audioUrl
    ) {
      const audioElement = new Audio(lastMessage.audioUrl);
      audioElement.play().catch((error) => {
        console.log("Auto-play failed:", error);
      });
    }
  }, [messages]);

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        audioUrl: URL.createObjectURL(audioBlob),
        timestamp: new Date(),
        status: "processing",
      };

      setMessages((prev) => [...prev, newMessage]);

      try {
        // Convert blob to ArrayBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const fileName = `recording-${newMessage.id}.wav`;

        // Send the file path to the new API endpoint
        const response = await fetch("/api/transcribe-local", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
            audioData: Array.from(new Uint8Array(arrayBuffer)),
          }),
        });

        const data = await response.json();

        // Add agent's response
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          timestamp: new Date(),
          status: "completed",
          outputDirectory: data.outputDirectory,
          audioUrl: data.audioData,
        };

        setMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: "completed" as const }
              : msg
          );
          return [...updatedMessages, agentMessage];
        });
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "error" } : msg
          )
        );
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Messages Card */}
      <div className="mx-auto w-full max-w-3xl">
        <Card>
          <CardHeader className="p-3">
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-full">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    } w-full`}
                  >
                    <div
                      className={`w-full max-w-[95%] rounded-lg p-4 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">
                          {message.type === "user" ? "You" : "AI Agent"}
                        </span>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.status === "processing" && (
                          <div className="flex items-center gap-2 ml-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Processing...</span>
                          </div>
                        )}
                      </div>

                      {message.audioUrl && (
                        <div className="audio-player w-full bg-black/5 rounded-md p-1.5">
                          <audio
                            controls
                            src={message.audioUrl}
                            preload="metadata"
                            className="w-full h-8"
                            style={{ minHeight: "30px" }}
                          >
                            <source src={message.audioUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio Controls Card */}
      <div className="mx-auto w-full max-w-3xl">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center items-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Mic className="h-6 w-6" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    size="icon"
                    className="h-12 w-12 rounded-full animate-pulse"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Recording: {recordingTime}s
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
