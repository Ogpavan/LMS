"use client";
import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, Play, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChevronBack from "@/components/ChevronBack";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";

export default function UploadCourse() {
  // Refs for form fields
  const titleRef = useRef();
  const descRef = useRef();
  const instructorRef = useRef();
  const levelRef = useRef();
  const thumbnailRef = useRef();
  const chapterTitleRef = useRef();
  const chapterSummaryRef = useRef();
  const chapterVideoRef = useRef();
  const chapterDurationRef = useRef();

  // State for chapters
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [formLoading, setFormLoading] = useState(false); // <-- for loading form data
  const { user } = useUser();

  // Add chapter to list
  const handleAddChapter = (e) => {
    e.preventDefault();
    const newChapter = {
      title: chapterTitleRef.current?.value,
      summary: chapterSummaryRef.current?.value,
      videoUrl: chapterVideoRef.current?.value,
      duration: chapterDurationRef.current?.value,
    };
    if (newChapter.title) {
      setChapters([...chapters, newChapter]);
      // Clear chapter fields
      chapterTitleRef.current.value = "";
      chapterSummaryRef.current.value = "";
      chapterVideoRef.current.value = "";
      chapterDurationRef.current.value = "";
    }
  };

  // Remove chapter
  const handleRemoveChapter = (idx) => {
    setChapters(chapters.filter((_, i) => i !== idx));
  };

  // Upload course to API
  const uploadCourse = async (status) => {
    setLoading(true);
    const data = {
      title: titleRef.current?.value,
      description: descRef.current?.value,
      instructor: instructorRef.current?.value,
      level: levelRef.current?.value,
      thumbnail: thumbnailRef.current?.files?.[0]?.name || "",
      chapters,
      status,
      userId: user.id,
    };
    try {
      // 1. Upload image to Cloudinary
      const file = thumbnailRef.current?.files?.[0];
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "LMSImages"); // <-- must match Cloudinary preset
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgData = await res.json();
        imageUrl = imgData.secure_url;
      }

      // 2. Send imageUrl to your backend
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, thumbnail: imageUrl }),
      });
      const result = await res.json();
      if (result.success) {
        alert(
          `Course ${
            status === "draft" ? "saved to draft" : "published"
          } successfully!`
        );
        // Optionally reset form here
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  // Save course (edit mode)
  const saveCourse = async (status) => {
    setLoading(true);

    // 1. Handle image upload if changed
    let imageUrl = thumbnailUrl; // default to existing thumbnail
    const file = thumbnailRef.current?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "LMSImages");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgData = await res.json();
      imageUrl = imgData.secure_url;
    }

    // 2. Prepare payload
    const payload = {
      id: editId,
      title: titleRef.current.value,
      description: descRef.current.value,
      instructor: instructorRef.current.value,
      level: levelRef.current.value,
      thumbnail: imageUrl, // use the correct imageUrl
      chapters,
      status,
      userId: user?.id,
    };

    const res = await fetch("/api/course", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      alert(`Course ${status} successfully!`);
    } else {
      let errorMsg = "Unknown error";
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
      } else {
        errorMsg = await res.text();
      }
      alert("Error: " + errorMsg);
    }
  };

  // Add this function to unpublish the course
  const unpublishCourse = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/course", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title: titleRef.current.value,
          description: descRef.current.value,
          instructor: instructorRef.current.value,
          level: levelRef.current.value,
          thumbnail: thumbnailUrl,
          chapters,
          status: "draft",
          userId: user?.id, // set status to draft to unpublish
        }),
      });
      setLoading(false);
      if (res.ok) {
        alert("Course unpublished (set to draft)!");
      } else {
        let errorMsg = "Unknown error";
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } else {
          errorMsg = await res.text();
        }
        alert("Error: " + errorMsg);
      }
    } catch (err) {
      setLoading(false);
      alert("Error: " + err.message);
    }
  };

  // Load course data for editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");
    if (courseId) {
      setFormLoading(true);
      fetch(`/api/course?id=${courseId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.course) {
            // Wait for refs to be available
            setTimeout(() => {
              if (titleRef.current) titleRef.current.value = data.course.title;
              if (descRef.current)
                descRef.current.value = data.course.description;
              if (instructorRef.current)
                instructorRef.current.value = data.course.instructor;
              if (levelRef.current) levelRef.current.value = data.course.level;
            }, 0);
            setChapters(data.course.chapters || []);
            setEditId(data.course.id);
            setThumbnailUrl(data.course.thumbnail);
          }
        })
        .finally(() => setFormLoading(false));
    }
  }, []);

  return (
    <div className="flex justify-center w-[90vw] mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="px-4 py-12">
          {formLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
              <span className="ml-4 text-gray-600 dark:text-gray-300">
                Loading course...
              </span>
            </div>
          ) : (
            <>
              {/* Align title and buttons */}
              <div className="flex items-center justify-between mb-8">
                {/* Title Section */}
                <div className="flex items-center gap-4">
                  <ChevronBack />
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {editId ? "Edit Course" : "Upload New Course"}
                    </h1>
                    <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                      {editId
                        ? "Edit and update your course"
                        : "Create and upload a new course"}
                    </p>
                  </div>
                </div>
                {/* Buttons Section */}
                <div className="flex gap-2">
                  {editId ? (
                    <>
                      <Button
                        type="button"
                        className="rounded-full bg-blue-600 text-white"
                        disabled={loading}
                        onClick={() => saveCourse("published")}
                      >
                        {loading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        className="rounded-full text-yellow-500 border border-yellow-500 bg-white hover:bg-yellow-500 hover:text-white"
                        disabled={loading}
                        onClick={unpublishCourse}
                      >
                        {loading ? "Unpublishing..." : "Unpublish"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="rounded-full"
                        disabled={loading}
                        onClick={() => uploadCourse("draft")}
                      >
                        {loading ? "Saving..." : "Save to Draft"}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            className="rounded-full bg-blue-500 hover:bg-blue-700 text-white ml-2"
                            disabled={loading}
                          >
                            Publish
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Publish Course</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to publish this course? It
                              will be visible to all users.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" type="button">
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={() => uploadCourse("published")}
                              disabled={loading}
                            >
                              {loading ? "Publishing..." : "Publish"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
              <form id="upload-course-form" className="space-y-6">
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
                              ref={titleRef}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300"
                              placeholder="Enter course title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Description
                            </label>
                            <textarea
                              ref={descRef}
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300"
                              placeholder="Enter course description"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Instructor
                              </label>
                              <Input
                                ref={instructorRef}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                placeholder="Enter instructor name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Level
                              </label>
                              <select
                                ref={levelRef}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Select level
                                </option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Course Thumbnail
                            </label>
                            <input
                              ref={thumbnailRef}
                              type="file"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            />
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
                            ref={chapterTitleRef}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            placeholder="Chapter title"
                          />
                          <textarea
                            ref={chapterSummaryRef}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            placeholder="Chapter summary"
                            rows={2}
                          />
                          <Input
                            ref={chapterVideoRef}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            placeholder="YouTube video URL"
                          />
                          <Input
                            ref={chapterDurationRef}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            placeholder="Duration (e.g., 12 mins)"
                          />
                          <Button
                            type="button"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                            onClick={handleAddChapter}
                          >
                            <Plus size={20} />
                            Add Chapter
                          </Button>
                        </div>
                        {/* Chapters List */}
                        <div className="space-y-4">
                          {chapters.map((ch, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border"
                            >
                              <div className="flex items-center gap-4">
                                <BookOpen className="text-blue-600" size={20} />
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {ch.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {ch.duration}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleRemoveChapter(idx)}
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
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Upload className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                              Beginner
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Course Title
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Instructor Name
                          </p>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            Course description will appear here
                          </p>
                        </div>
                      </div>
                      {/* Chapters Preview */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Chapters ({chapters.length})
                        </h3>
                        {chapters.map((ch, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Play size={16} className="text-blue-600" />
                              <span className="font-medium text-gray-900 dark:text-white">
                                {ch.title}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {ch.summary}
                            </p>
                            <div className="mt-2 text-xs text-gray-400">
                              {ch.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
