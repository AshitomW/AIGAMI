"use client";
import { User } from "@supabase/supabase-js";
import React, { Fragment, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowUpIcon } from "lucide-react";
import { askAIAboutNotes } from "@/lib/actions/ai";
import "./ai-response.css";
type Props = {
  user: User | null;
};
function AIChat({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const handleOnOpenChange = function (isOpen: boolean) {
    if (!user) {
      router.push("/auth/signin");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = function () {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  const handleClickInput = function () {
    textAreaRef.current?.focus();
  };
  const handleSubmit = function () {
    if (!questionText.trim()) return;
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async function () {
      const response = await askAIAboutNotes(newQuestions, responses);
      setResponses((prev) => [...prev, response]);
      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = function () {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = function (e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Ask AI</Button>
        </DialogTrigger>
        <DialogContent
          className="flex h-[85vh] w-full max-w-8xl sm:max-w-4xl flex-col overflow-y-auto"
          ref={contentRef}
        >
          <DialogHeader>
            <DialogTitle>Ask AI About Your Notes</DialogTitle>
            <DialogDescription>
              Our AI can answer questions about all your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-8">
            {questions.map((question, index) => {
              return (
                <Fragment key={index}>
                  <p className="ml-auto max-w-[60%] rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                    {question}
                  </p>
                  {responses[index] && (
                    <p
                      className="bot-response text-muted-foreground text-sm"
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                    />
                  )}
                </Fragment>
              );
            })}
            {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
          </div>
          <div
            className="mt-auto flex cursor-text flex-col rounded-large border p-4 "
            onClick={handleClickInput}
          >
            <Textarea
              ref={textAreaRef}
              placeholder="Ask Me Anything About Your Notes"
              className="resize-none rounded-none border-none bg-transparent p-0 shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{
                minHeight: "0",
                lineHeight: "normal",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Button className="ml-auto size-8 rounded-full">
              <ArrowUpIcon className="text-background" />
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AIChat;
