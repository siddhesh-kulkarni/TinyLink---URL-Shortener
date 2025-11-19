"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/app/lib/axios";
import { FiArrowLeft } from "react-icons/fi";

interface LinkStats {
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function StatsPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/links/${code}`);
        setLink(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Link not found");
        } else {
          setError("Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      fetchStats();
    }
  }, [code]);

  const baseUrl =
    typeof window !== "undefined" ? `${window.location.origin}` : "";

  const shortUrl = `${baseUrl}/${code}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString)?.toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Copied to clipboard!");
    } catch (err) {
      setError("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Link not found"}</p>
          <Link
            href="/"
            className="inline-block bg-[#022d94] text-white px-6 py-2 rounded-lg hover:bg-[#022d94]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
              Link Statistics
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shortUrl}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="px-4 py-2 bg-[#022d94] text-white rounded-lg hover:bg-[#022d94]"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL
                </label>
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <a
                    href={link?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#022d94] hover:underline break-all"
                  >
                    {link?.url}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
                  <p className="text-3xl font-bold text-[#022d94]">
                    {link?.clicks || 0}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Last Clicked</p>
                  <p className="text-sm font-semibold text-green-700">
                    {formatDate(link?.lastClicked)}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="text-sm font-semibold text-purple-700">
                    {formatDate(link?.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Code
                </label>
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-gray-700">
                  {link?.code}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
