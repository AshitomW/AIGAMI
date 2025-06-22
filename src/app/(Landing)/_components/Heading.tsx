"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Heading() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-4 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl sm:text-5xl font-bold text-black dark:text-white leading-tight">
          Your Ideas, Documents & Plans. Unified. Welcome To
          <span className="underline decoration-black dark:decoration-white decoration-4 underline-offset-8">
            {" "}
            AIGAMI
          </span>
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400 animate-fade-in-up-delay-1">
          AIGAMI is a workspace where gaming meets artificial intelligence to
          improve you and your notes.
        </h3>
      </div>
      <div className="animate-fade-in-up-delay-2">
        <Link href="/auth/signin">
          <Button
            size="lg"
            className="group bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-lg rounded-md transition-all duration-200 hover:scale-105"
          >
            Get Started
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
