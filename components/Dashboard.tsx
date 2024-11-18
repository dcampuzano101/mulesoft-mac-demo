"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ChatApp from "@/components/ChatApp";
import FileUploadDropzone from "@/components/Upload";
import { MessageSquare, Upload, Mic } from "lucide-react";
import AudioRecorder from "@/components/AudioRecorder";
import Image from "next/image";
import macVectorsLogo from "@/lib/images/mac-vectors-logo.svg";
import macAiChainLogo from "@/lib/images/mac-ai-chain-logo.png";
import macWhispererLogo from "@/lib/images/mac-whisperer-logo.png";

export default function Dashboard() {
  return (
    <div>
      <Card className="w-full min-w-[75%] max-w-[90%] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            MuleSoft AI Chain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Desktop Layout */}
          <div className="hidden md:block space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4">
                <Image
                  src={macVectorsLogo}
                  alt="MAC Vectors Logo"
                  width={75}
                  height={75}
                  className="object-contain"
                />
                <CardTitle>MAC Vectors Connector</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <FileUploadDropzone />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Image
                    src={macAiChainLogo}
                    alt="MAC AI Chain Logo"
                    width={75}
                    height={75}
                    className="object-contain"
                  />
                  <CardTitle>MAC AI Chain Connector</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(50vh-4rem)] overflow-hidden">
                    <ChatApp />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Image
                    src={macWhispererLogo}
                    alt="MAC Whisperer Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  <CardTitle>MAC Whisperer Connector</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[calc(50vh-4rem)] overflow-auto">
                    <div className="flex items-center justify-center border-r">
                      <AudioRecorder />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Layout */}
          <Tabs defaultValue="upload" className="md:hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      <Upload className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[calc(70vh-4rem)] overflow-auto">
                    <FileUploadDropzone />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="chat">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      <MessageSquare className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(70vh-4rem)] overflow-hidden">
                    <ChatApp />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="voice">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      <Mic className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Voice Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[calc(70vh-4rem)] overflow-auto flex flex-col gap-4">
                    <div className="flex items-center justify-center border-b pb-4">
                      <AudioRecorder />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
