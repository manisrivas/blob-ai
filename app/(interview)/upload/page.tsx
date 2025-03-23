"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const router = useRouter();

  // State for text inputs
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<string>("");
  const [desiredRole, setDesiredRole] = useState<string>("");

  // State for file uploads
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Auto-resizing textarea
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "job" | "resume") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "job") {
        setJobFile(e.target.files[0]);
      } else {
        setResumeFile(e.target.files[0]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Navigate to the audio page after form submission
    router.push("/audio");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Job Description (Text or File) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Description</label>
            <textarea
              placeholder="Paste job link or description..."
              className="w-full px-4 py-2 border rounded-md focus:outline-blue-500 min-h-[50px] resize-none overflow-hidden"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                autoResize(e);
              }}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="mt-2 block w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
              onChange={(e) => handleFileChange(e, "job")}
            />
            {jobFile && <p className="text-sm text-gray-500 mt-1">Selected File: {jobFile.name}</p>}
          </div>

          {/* Resume (Text or File) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Resume</label>
            <textarea
              placeholder="Paste resume link or description..."
              className="w-full px-4 py-2 border rounded-md focus:outline-blue-500 min-h-[50px] resize-none overflow-hidden"
              value={resume}
              onChange={(e) => {
                setResume(e.target.value);
                autoResize(e);
              }}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-2 block w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
              onChange={(e) => handleFileChange(e, "resume")}
            />
            {resumeFile && <p className="text-sm text-gray-500 mt-1">Selected File: {resumeFile.name}</p>}
          </div>

          {/* Desired Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Desired Role</label>
            <input
              type="text"
              placeholder="Enter your desired role..."
              className="w-full px-4 py-2 border rounded-md focus:outline-blue-500"
              value={desiredRole}
              onChange={(e) => setDesiredRole(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-t from-blue-600 to-blue-500 text-white py-2 rounded-md"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default UploadPage;
