import React, { useState } from "react";
import { useRouter } from "next/router";
import { Progress } from "lucide-react";

export default function LearnPage() {
  const router = useRouter();
  const { id } = router.query;

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <div className="flex max-w-7xl mx-auto px-6 py-12">
      {/* Video Player */}
      <div className="flex-1 mr-8">
        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            src={`/videos/course-${id}.mp4`} // Replace with actual video source
            controls
            onTimeUpdate={(e) => {
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              setProgress((currentTime / duration) * 100);
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="flex-1 mx-4">
            <input
              type="range"
              value={progress}
              onChange={handleProgressChange}
              className="w-full"
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Chapters List */}
      <div className="w-1/3">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
          Chapters
        </h2>
        <ul className="space-y-4">
          {/* Replace with actual chapter data */}
          {["Chapter 1", "Chapter 2", "Chapter 3"].map((chapter, index) => (
            <li key={index} className="border rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-900">{chapter}</h3>
              <p className="text-gray-600">Summary of {chapter}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}