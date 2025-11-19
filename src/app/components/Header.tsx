"use client";

import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { ALL_LINKS, CREATE_LINK, LINK_STATISTICS, APP_NAME } from "@/app/lib/constants";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return ALL_LINKS;
    if (pathname === "/create") return CREATE_LINK;
    if (pathname.startsWith("/code/")) return LINK_STATISTICS;
    return APP_NAME;
  };

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 h-16 bg-white border-b border-gray-200 shadow-sm z-30">
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold text-gray-900 lg:ml-0">
          {getPageTitle()}
        </h1>

        <div className="w-10"></div>
      </div>
    </header>
  );
}
