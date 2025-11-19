"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { MdOutlineHome } from "react-icons/md";
import axiosInstance from "@/app/lib/axios";
import { HOME, CREATE } from "@/app/lib/constants";
import { IoClose } from "react-icons/io5";

interface LinkStats {
  code: string;
  clicks: number;
  lastClicked: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [topLinks, setTopLinks] = useState<LinkStats[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    async function fetchTopLinks() {
      try {
        const res = await axiosInstance.get("/api/links");
        const sorted = res?.data?.sort?.((a: LinkStats, b: LinkStats) => (b.clicks || 0) - (a.clicks || 0))?.slice(0, 5);
        setTopLinks(sorted || []);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTopLinks();
  }, []);

  const navigation = [
    { name: HOME, href: "/", icon: MdOutlineHome },
    { name: CREATE, href: "/create", icon: FiPlus },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/create") {
      return pathname === "/create";
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden w-full fixed inset-0 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-full lg:w-64 bg-white border-r border-gray-200 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                className="flex items-center lg:gap-2 lg:mb-5 gap-0 mb-3"
              >
                <div className="w-10 h-10 bg-[#022d94] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">TL</span>
                </div>
                <span className="text-2xl font-bold text-[#022d94]">
                  TinyLink
                </span>
              </Link>
              <Link href="/" onClick={onClose}>
                <IoClose className="w-6 h-6 text-black block lg:hidden" />
              </Link>
            </div>

            <div className="mt-2">
              <button
                onClick={() => router.push("/create")}
                className="text-white px-4 w-full py-3 rounded-[4px] bg-[#022d94] text-sm font-bold hover:bg-[#021d6b] transition-colors"
              >
                Create new
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation?.map?.((item:any) => {
              const Icon = item?.icon;
              const active = isActive(item?.href);

              return (
                <Link
                  key={item?.name}
                  href={item?.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 py-2 px-4 mb-3 rounded transition-all
                    ${
                      active
                        ? "text-[#022d94] border-l-4 border-[#022d94] bg-[#edf2ff]"
                        : "text-black hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active ? "text-[#022d94]" : "text-black"
                    }`}
                  />
                  <span className="font-medium">{item?.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
