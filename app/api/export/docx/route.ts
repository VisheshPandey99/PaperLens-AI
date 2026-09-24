import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, abstract, sections, citations, author = "ResearchLens AI Scholar" } = body;

    const docChildren: Paragraph[] = [];

    // Header Notice
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PAPERLENS AI — AI-GENERATED RESEARCH DRAFT (VERIFY CLAIMS BEFORE SUBMISSION)",
            italics: true,
            size: 16,
            color: "888888",
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // Title
    docChildren.push(
      new Paragraph({
        text: title || "Academic Research Paper",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Author
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Author: ${author}  |  Generated via PaperLens AI  |  Date: ${new Date().toLocaleDateString()}`,
            italics: true,
            size: 20,
            color: "555555",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Abstract
    if (abstract) {
      docChildren.push(
        new Paragraph({
          text: "ABSTRACT",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: abstract, size: 22 })],
          spacing: { after: 300 },
        })
      );
    }

    // Sections
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        docChildren.push(
          new Paragraph({
            text: `${sec.sectionNumber ? sec.sectionNumber + ". " : ""}${sec.title}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          })
        );

        const paragraphs = (sec.content || "").split("\n\n");
        for (const p of paragraphs) {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: p, size: 22 })],
              spacing: { after: 150 },
            })
          );
        }
      }
    }

    // Citations / References
    if (Array.isArray(citations) && citations.length > 0) {
      docChildren.push(
        new Paragraph({
          text: "REFERENCES",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      for (const cit of citations) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${cit.authors?.join(", ") || "Author"} (${cit.year || "n.d."}). ${cit.title}. ${cit.venue ? cit.venue + "." : ""} ${cit.doi ? "https://doi.org/" + cit.doi : cit.sourceUrl || ""}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    }

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren }],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${(title || "PaperLens-Paper").slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX document" }, { status: 500 });
  }
}
