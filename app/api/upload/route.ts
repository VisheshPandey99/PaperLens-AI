import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer } from "@/services/pdf/pdfParser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF document was attached. Please upload a valid research paper file." },
        { status: 400 }
      );
    }

    // Maximum file size: 25MB
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 25MB limit. Please upload a smaller PDF or extract key sections." },
        { status: 413 }
      );
    }

    // Verify MIME type or extension
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF research papers (.pdf) are supported." },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extracted = await parsePdfBuffer(buffer, file.name);

    if (!extracted.text || extracted.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to extract text from this PDF. It may be scanned or password-protected." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      fileSize: file.size,
      pageCount: extracted.pageCount,
      extractedText: extracted.text,
      previewSnippet: extracted.text.slice(0, 500),
    });
  } catch (error: any) {
    console.error("PDF upload/parsing error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the PDF file." },
      { status: 500 }
    );
  }
}
