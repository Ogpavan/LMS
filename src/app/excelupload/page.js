"use client";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ExcelUploadPage() {
  const [previewData, setPreviewData] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef();

  // Download sample Excel file
  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "title",
        "description",
        "instructor",
        "level",
        "thumbnail",
        "chapter_title_1",
        "chapter_summary_1",
        "chapter_videoUrl_1",
        "chapter_duration_1",
        "chapter_title_2",
        "chapter_summary_2",
        "chapter_videoUrl_2",
        "chapter_duration_2",
      ],
      [
        "Sample Course",
        "This is a sample course description.",
        "John Doe",
        "Beginner",
        "https://image.url",
        "Intro",
        "Introduction to course",
        "https://youtube.com/sample1",
        "10",
        "Advanced Topic",
        "Deep dive into topic",
        "https://youtube.com/sample2",
        "15",
      ],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    XLSX.writeFile(workbook, "sample_courses.xlsx");
  };

  // Handle Excel upload and preview
  const handleExcelUpload = (e) => {
    setUploadError("");
    setUploadSuccess(false);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setPreviewData(json);
      } catch (err) {
        setUploadError("Invalid Excel file format.");
        setPreviewData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Dropbox style drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleExcelUpload({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Bulk upload to API
  const handleBulkUpload = async () => {
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    try {
      const res = await fetch("/api/course/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: previewData }),
      });
      const result = await res.json();
      if (result.success) {
        setUploadSuccess(true);
        setPreviewData([]);
      } else {
        setUploadError(result.error || "Upload failed.");
      }
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="flex justify-center max-w-[90vw] mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900 w-full min-h-screen">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Excel Bulk Upload
                </h1>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                  Upload your courses in bulk using Excel
                </p>
              </div>
            </div>
          </div>
          <Card className="p-6 mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Excel Format Example
              </h2>
              <Button
                type="button"
                className="rounded-full bg-green-600 text-white"
                onClick={handleDownloadSample}
              >
                Download Sample Excel
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-2 py-2 font-semibold text-left">title</th>
                    <th className="px-2 py-2 font-semibold text-left">
                      description
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      instructor
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">level</th>
                    <th className="px-2 py-2 font-semibold text-left">
                      thumbnail
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_title_1
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_summary_1
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_videoUrl_1
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_duration_1
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_title_2
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_summary_2
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_videoUrl_2
                    </th>
                    <th className="px-2 py-2 font-semibold text-left">
                      chapter_duration_2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-900">
                    <td className="px-2 py-2">Sample Course</td>
                    <td className="px-2 py-2">
                      This is a sample course description.
                    </td>
                    <td className="px-2 py-2">John Doe</td>
                    <td className="px-2 py-2">Beginner</td>
                    <td className="px-2 py-2">https://image.url</td>
                    <td className="px-2 py-2">Intro</td>
                    <td className="px-2 py-2">Introduction to course</td>
                    <td className="px-2 py-2">https://youtube.com/sample1</td>
                    <td className="px-2 py-2">10</td>
                    <td className="px-2 py-2">Advanced Topic</td>
                    <td className="px-2 py-2">Deep dive into topic</td>
                    <td className="px-2 py-2">https://youtube.com/sample2</td>
                    <td className="px-2 py-2">15</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-gray-700 dark:text-gray-300 text-sm space-y-2">
              <b>Instructions:</b>
              <ul className="list-disc ml-5">
                <li>Fill each chapter in its own set of columns.</li>
                <li>
                  You can add more chapter columns as needed (chapter_title_3,
                  ...).
                </li>
                <li>
                  <b>level</b> should be "Beginner", "Intermediate", or
                  "Advanced".
                </li>
                <li>
                  <b>thumbnail</b> is an image URL.
                </li>
                <li>All columns are required for each course.</li>
              </ul>
            </div>
          </Card>
          <Card className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-4">
              <label className="font-medium text-gray-900 dark:text-white mb-2">
                Upload Excel File
              </label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl px-6 py-10 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
                tabIndex={0}
                role="button"
                aria-label="Upload Excel File"
              >
                <span className="text-gray-500 dark:text-gray-400 mb-2">
                  Drag & drop your Excel file here, or click to select file
                </span>
                <Button
                  type="button"
                  className="rounded-full bg-green-600 text-white mt-2"
                  onClick={() => fileInputRef.current.click()}
                >
                  Browse File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
              </div>
              {uploadError && (
                <div className="text-red-500 text-xs mt-2">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="text-green-600 text-xs mt-2">
                  Courses uploaded successfully!
                </div>
              )}
              {previewData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
                    Preview Uploaded Courses
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-2 py-2 font-semibold text-left"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="bg-white dark:bg-gray-900">
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-2 py-2">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    type="button"
                    className="rounded-full bg-blue-600 text-white mt-6"
                    onClick={handleBulkUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload All Courses"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ExcelUploadPage;
