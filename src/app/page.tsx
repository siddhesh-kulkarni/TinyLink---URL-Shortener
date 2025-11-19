"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/app/lib/axios";
import { LINK, LINKS } from "./lib/constants";
import { IoSearchOutline } from "react-icons/io5";
import { FaChartBar, FaLink, FaRegCopy, FaTrash } from "react-icons/fa";

interface LinkData {
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function fetchLinks() {
    try {
      setFetching(true);
      const res = await axiosInstance.get("/api/links");
      setLinks(res?.data || []);
      setFilteredLinks(res?.data || []);
    } catch (err) {
      setError("Failed to load links");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLinks(links);
      return;
    }

    const query = searchQuery?.toLowerCase() || "";
    const filtered = links?.filter?.(
      (link: LinkData) =>
        link?.code?.toLowerCase()?.includes(query) ||
        link?.url?.toLowerCase()?.includes(query)
    );
    setFilteredLinks(filtered);
  }, [searchQuery, links]);

  async function deleteLink(code: string) {
    if (
      !confirm(`Are you sure you want to delete the link with code "${code}"?`)
    )
      return;

    try {
      await axiosInstance.delete(`/api/links/${code}`);
      await fetchLinks();
      setSuccess("Link deleted successfully!");
    } catch (err) {
      setError("Failed to delete link");
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Copied to clipboard!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString)?.toLocaleString();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Links</h1>
          <p className="text-gray-600">Manage and track your shortened URLs</p>
        </div>

        <div
          id="links"
          className="bg-white rounded-xl border border-gray-100 overflow-hidden scroll-mt-8"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredLinks?.length}{" "}
                  {filteredLinks?.length === 1 ? LINK : LINKS}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="text-gray-400 size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by code or URL..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 text-black rounded-sm focus:outline-none focus:ring-1 focus:ring-[#022d94] focus:border-[#022d94] w-full sm:w-64 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {fetching ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading links...</p>
            </div>
          ) : filteredLinks?.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <FaLink className="text-gray-400 size-6 mx-auto mb-4"/>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery
                  ? "No links match your search."
                  : "No links created yet. Create your first link above!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Short Link
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks?.map?.((link: LinkData) => {
                    const shortUrl = `${baseUrl}/${link?.code}`;
                    return (
                      <tr
                        key={link?.code}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-semibold text-[#022d94] bg-[#edf2ff] px-2 py-1 rounded">
                                  {link?.code}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(shortUrl)}
                                  className="text-gray-400 hover:text-[#022d94] transition-colors"
                                  title="Copy short URL"
                                >
                                  <FaRegCopy className="text-gray-400 size-4" />
                                </button>
                              </div>
                              <a
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-[#022d94] mt-1 block"
                              >
                                {shortUrl}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={link?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#022d94] hover:text-[#022d94] hover:underline max-w-md truncate block"
                            title={link?.url}
                          >
                            {link?.url?.length > 60
                              ? `${link?.url?.substring(0, 60)}...`
                              : link?.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#edf2ff] text-[#022d94]">
                            {link?.clicks || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                          {formatDate(link?.lastClicked)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/code/${link?.code}`}
                              className="text-[#022d94] hover:text-[#022d94] font-medium flex items-center gap-1"
                            >
                              <FaChartBar className="text-[#022d94] size-4" />
                              Stats
                            </Link>
                            <button
                              onClick={() => deleteLink(link?.code)}
                              className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                            >
                              <FaTrash className="text-red-500 size-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
