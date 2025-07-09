"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  X,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import { extractTextFromDocument, createNoteFromOCR } from "@/lib/actions/ocr";
import { useRouter } from "next/navigation";

interface OCRResult {
  text: string;
  filename: string;
  characterCount: number;
  wordCount: number;
  confidence?: {
    mean: number;
    min: number;
    max: number;
  };
}

export default function OCRImportButton() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "application/pdf",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description:
          "Please upload an image (PNG, JPG, GIF, BMP, TIFF) or PDF file.",
      });
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload a file smaller than 16MB.",
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  const handleExtractText = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("include_confidence", "true");

      const extractResult = await extractTextFromDocument(formData);

      clearInterval(progressInterval);
      setProgress(100);

      if (extractResult.success && extractResult.text.trim()) {
        setResult({
          text: extractResult.text,
          filename: extractResult.filename,
          characterCount: extractResult.characterCount,
          wordCount: extractResult.wordCount,
          confidence: extractResult.confidence,
        });

        toast.success("Text extracted successfully!", {
          description: `Found ${extractResult.wordCount} words from ${extractResult.filename}`,
        });
      } else {
        toast.warning("No text found", {
          description:
            "The document appears to be empty or contains no readable text.",
        });
      }
    } catch (error) {
      toast.error("Extraction failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleImportNote = async () => {
    if (!result) return;

    setIsProcessing(true);
    try {
      const noteResult = await createNoteFromOCR(result.text, result.filename);

      if (noteResult.success) {
        toast.success("Note created successfully!", {
          description: `Imported ${result.wordCount} words from ${result.filename}`,
        });

        setOpen(false);
        router.push(`/notes?noteId=${noteResult.noteId}`);
      }
    } catch (error) {
      toast.error("Failed to create note", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileImage className="w-4 h-4" />
          Import from Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Note from Document</DialogTitle>
          <DialogDescription>
            Upload an image or PDF to extract text and create a new note
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif,.bmp,.tiff,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Choose an image or PDF file to extract text from
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </Button>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetDialog}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {selectedFile && !result && (
                <Button
                  onClick={handleExtractText}
                  disabled={isProcessing}
                  className="w-full gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting Text...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Extract Text
                    </>
                  )}
                </Button>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-gray-600">
                    Processing document...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Extracted Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Words:</span>{" "}
                    {result.wordCount}
                  </div>
                  <div>
                    <span className="font-medium">Characters:</span>{" "}
                    {result.characterCount}
                  </div>
                  {result.confidence && (
                    <>
                      <div>
                        <span className="font-medium">Confidence:</span>{" "}
                        {result.confidence.mean.toFixed(1)}%
                      </div>
                      <div>
                        <span className="font-medium">Quality:</span>{" "}
                        {result.confidence.mean > 80
                          ? "High"
                          : result.confidence.mean > 60
                          ? "Medium"
                          : "Low"}
                      </div>
                    </>
                  )}
                </div>

                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{result.text}</p>
                </div>

                <Button
                  onClick={handleImportNote}
                  disabled={isProcessing}
                  className="w-full gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Note...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Import as New Note
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
