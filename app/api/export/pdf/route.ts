import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, abstract, sections, citations, author = "PaperLens AI Scholar" } = body;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - margin * 2;
    let yPos = 25;

    // Header disclaimer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("PAPERLENS AI — AI-GENERATED RESEARCH DRAFT (VERIFY CLAIMS BEFORE SUBMISSION)", margin, 15);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(20, 20, 30);
    const titleLines = doc.splitTextToSize(title || "Research Paper Draft", textWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 8 + 4;

    // Author
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 80);
    doc.text(`Author: ${author} | Date: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 10;

    // Horizontal rule
    doc.setDrawColor(220, 220, 230);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Abstract
    if (abstract) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 40, 90);
      doc.text("ABSTRACT", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 50);
      const abstractLines = doc.splitTextToSize(abstract, textWidth);
      doc.text(abstractLines, margin, yPos);
      yPos += abstractLines.length * 5 + 8;
    }

    // Sections
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        if (yPos > 260) {
          doc.addPage();
          yPos = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(25, 30, 80);
        doc.text(`${sec.sectionNumber ? sec.sectionNumber + ". " : ""}${sec.title}`, margin, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 50);
        const contentLines = doc.splitTextToSize(sec.content || "", textWidth);

        for (const line of contentLines) {
          if (yPos > 270) {
            doc.addPage();
            yPos = 25;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        }
        yPos += 6;
      }
    }

    // Citations
    if (Array.isArray(citations) && citations.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 25;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(25, 30, 80);
      doc.text("REFERENCES", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 70);

      for (const cit of citations) {
        if (yPos > 270) {
          doc.addPage();
          yPos = 25;
        }
        const citStr = `• ${cit.authors?.join(", ") || "Author"} (${cit.year || "n.d."}). ${cit.title}. ${cit.venue ? cit.venue + "." : ""} ${cit.doi ? "DOI: " + cit.doi : cit.sourceUrl || ""}`;
        const citLines = doc.splitTextToSize(citStr, textWidth);
        doc.text(citLines, margin, yPos);
        yPos += citLines.length * 4.5 + 2;
      }
    }

    const pdfBuffer = new Uint8Array(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(title || "PaperLens-Paper").slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "Failed to generate PDF document" }, { status: 500 });
  }
}
