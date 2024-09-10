"use client";

import { useState, useRef } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Video, Music, Upload, SearchCheck } from "lucide-react";
import Github from "@/assets/github.png";
import Image from "next/image";
import toast from "react-hot-toast";

export default function MediaPreview() {
  const [mediaType, setMediaType] = useState<"video" | "audio">("video");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (type: "video" | "audio") => {
    setMediaType(type);
    setMediaUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const callAPI = () => {
    toast.promise(
      fetch("https://api.deepfake-detection.ria.dev/detect", {
        method: "POST",
        body: JSON.stringify({ mediaUrl, mediaType }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json()),
      {
        loading: "Detecting deepfake...",
        success: (data) => {
          if (data.isDeepfake) {
            return "Deepfake detected!";
          } else {
            return "No deepfake detected!";
          }
        },
        error: "Failed to detect deepfake",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col relative">
      <main className="flex-grow p-4 overflow-auto pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center my-6 text-gray-800">
            Deepfake Detection
          </h1>

          {mediaUrl ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Preview
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                {mediaType === "video" ? (
                  <video src={mediaUrl} controls className="w-full rounded-lg">
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <audio src={mediaUrl} controls className="w-full">
                    Your browser does not support the audio tag.
                  </audio>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">
                Select a file to preview it here
              </p>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-2 py-2">
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={mediaType === "video"}
            onPressedChange={() => handleToggle("video")}
            aria-label="Select video"
            className="w-24 rounded-full"
          >
            <Video className="mr-2 h-4 w-4" />
            Video
          </Toggle>
          <Toggle
            pressed={mediaType === "audio"}
            onPressedChange={() => handleToggle("audio")}
            aria-label="Select audio"
            className="w-24 rounded-full"
          >
            <Music className="mr-2 h-4 w-4" />
            Audio
          </Toggle>
          <Button
            onClick={handleUploadClick}
            className="bg-purple-600 hover:bg-purple-700 rounded-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>

          <Button
            onClick={() => callAPI()}
            className="bg-purple-600 hover:bg-purple-700 rounded-full"
          >
            <SearchCheck className="mr-2 h-4 w-4" />
            Detect deep fake
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === "video" ? "video/*" : "audio/*"}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <h1 className="text-black flex justify-center items-center text-sm mb-5 gap-5">
        <span> Built by Ria / Team ❤️</span>
        <span
          className="cursor-pointer"
          onClick={() => {
            window.open("https://google.com");
          }}
        >
          <Image src={Github} alt="" className="h-5 w-5" />
        </span>
      </h1>
    </div>
  );
}
