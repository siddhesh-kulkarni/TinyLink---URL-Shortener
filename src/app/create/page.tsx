"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import axiosInstance from "@/app/lib/axios";

export default function CreatePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeError, setCodeError] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const createLink = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCodeError("");

    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    if (code.trim() && !/^[A-Za-z0-9]{6,8}$/.test(code.trim())) {
      setCodeError("Custom code must be 6-8 alphanumeric characters");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/links", {
        url: url.trim(),
        code: code.trim() || undefined,
      });

      setSuccess("Link created successfully!");
      setUrl("");
      setCode("");
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 409
          ? "This custom code already exists. Please choose another."
          : err.response?.data?.error ||
            "Failed to create link. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Create Short Link
            </h1>

            <form onSubmit={createLink} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your long URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#022d94] focus:border-[#022d94]"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom back-half (optional)
                  <span className="text-xs text-gray-500 ml-2">
                    6-8 alphanumeric characters
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-100 text-gray-600 font-mono text-sm whitespace-nowrap">
                    {baseUrl}/
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="mycode"
                      className={`w-full px-4 py-2 border rounded-r-lg bg-gray-50 font-mono text-gray-700 focus:outline-none focus:ring-2 ${
                        codeError
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#022d94] focus:border-[#022d94]"
                      }`}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setCodeError("");
                      }}
                      disabled={loading}
                    />
                    {codeError && (
                      <p className="text-red-600 text-xs mt-1">{codeError}</p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <p>{success}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#022d94] text-white rounded-lg hover:bg-[#021d6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Creating..." : "Shorten URL"}
                </button>
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#022d94]"></div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
