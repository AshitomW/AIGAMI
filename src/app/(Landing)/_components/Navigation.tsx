"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              AIGAMI
            </h2>
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <Link href="/auth/signin">
              <Button className="bg-black cursor-pointer hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
