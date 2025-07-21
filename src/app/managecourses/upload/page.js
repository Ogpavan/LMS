"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Upload, Play, BookOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChevronBack from "@/components/ChevronBack";

export default function UploadCourse() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id"); // Get the course ID from the query parameter

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    level: "Beginner",
    image: null,
    chapters: [],
  });

  const [currentChapter, setCurrentChapter] = useState({
    title: "",
    summary: "",
    videoUrl: "",
    duration: "",
  });

  const [isPublished, setIsPublished] = useState(false);

  // Fetch course data if editing
  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const res = await fetch("/api/course", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ getById: courseId }),
          });
          const data = await res.json();
          if (data.success && data.course) {
            setCourseData(data.course);
            setIsPublished(data.course.isPublished || false);
          } else {
            toast.error("Failed to fetch course data.");
          }
        } catch (err) {
          toast.error("Network error: " + err.message);
        }
      };
      fetchCourse();
    }
  }, [courseId]);

  // Handle form changes
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add chapter
  const addChapter = () => {
    if (currentChapter.title && currentChapter.videoUrl) {
      setCourseData((prev) => ({
        ...prev,
        chapters: [...prev.chapters, currentChapter],
      }));
      setCurrentChapter({
        title: "",
        summary: "",
        videoUrl: "",
        duration: "",
      });
      toast.success("Chapter added!");
    } else {
      toast.error("Chapter title and video URL are required.");
    }
  };

  // Remove chapter
  const removeChapter = (index) => {
    setCourseData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, idx) => idx !== index),
    }));
    toast.info("Chapter removed.");
  };

  // Handle publish toggle
  const handlePublishToggle = async (checked) => {
    try {
      const res = await fetch("/api/course", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseData.id,
          isPublished: checked,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsPublished(checked);
        toast.success(
          checked ? "Course published successfully!" : "Course saved as draft."
        );
      } else {
        toast.error(data.error || "Failed to update course status.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center w-[90vw] mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <ChevronBack />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {courseId ? "Edit Course" : "Upload New Course"}
                </h1>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                  {courseId
                    ? "Edit your course details"
                    : "Create and upload a new course"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-200">
                Publish
              </span>
              <Switch
                checked={isPublished}
                onCheckedChange={handlePublishToggle}
                disabled={!courseData.id}
              />
            </div>
          </div>

          <form id="upload-course-form" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Basic Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Course Title
                        </label>
                        <Input
                          type="text"
                          name="title"
                          value={courseData.title}
                          onChange={handleCourseChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter course title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={courseData.description}
                          onChange={handleCourseChange}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter course description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Instructor
                          </label>
                          <Input
                            type="text"
                            name="instructor"
                            value={courseData.instructor}
                            onChange={handleCourseChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter instructor name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Level
                          </label>
                          <Select
                            value={courseData.level}
                            onValueChange={(value) =>
                              setCourseData((prev) => ({
                                ...prev,
                                level: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Course Thumbnail
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapters Section */}
                  <div className="border-t pt-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Chapters
                    </h2>

                    {/* Add Chapter Form */}
                    <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Input
                        type="text"
                        value={currentChapter.title}
                        onChange={(e) =>
                          setCurrentChapter((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        placeholder="Chapter title"
                      />
                      <textarea
                        value={currentChapter.summary}
                        onChange={(e) =>
                          setCurrentChapter((prev) => ({
                            ...prev,
                            summary: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        placeholder="Chapter summary"
                        rows={2}
                      />
                      <Input
                        type="text"
                        value={currentChapter.videoUrl}
                        onChange={(e) =>
                          setCurrentChapter((prev) => ({
                            ...prev,
                            videoUrl: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        placeholder="YouTube video URL"
                      />
                      <Input
                        type="text"
                        value={currentChapter.duration}
                        onChange={(e) =>
                          setCurrentChapter((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        placeholder="Duration (e.g., 12 mins)"
                      />
                      <Button
                        type="button"
                        onClick={addChapter}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Chapter
                      </Button>
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-4">
                      {courseData.chapters.map((chapter, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border"
                        >
                          <div className="flex items-center gap-4">
                            <BookOpen className="text-blue-600" size={20} />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {chapter.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {chapter.duration}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChapter(idx)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Course Preview
                </h2>
                <div className="space-y-6">
                  {/* Course Card Preview */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md">
                    <div className="relative h-48">
                      {courseData.image ? (
                        <img
                          src={courseData.image}
                          alt={courseData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                          {courseData.level}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {courseData.title || "Course Title"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {courseData.instructor || "Instructor Name"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {courseData.description ||
                          "Course description will appear here"}
                      </p>
                    </div>
                  </div>

                  {/* Chapters Preview */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Chapters ({courseData.chapters.length})
                    </h3>
                    {courseData.chapters.map((chapter, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Play size={16} className="text-blue-600" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {chapter.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {chapter.summary}
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          {chapter.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
