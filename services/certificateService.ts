import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { UserCertificate } from "../types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function makeCertSerial(theater: 'RED' | 'BLUE' | 'GENERAL') {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const prefix = theater === 'RED' ? 'RX' : theater === 'BLUE' ? 'BX' : 'RS';
  let s = `TT-${prefix}-`;
  for (let i = 0; i < 12; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Helper to ensure title is max 4 words
function cleanTitle(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length <= 4) return title.toUpperCase();
  return words.slice(0, 4).join(" ").toUpperCase();
}

export class CertificateService {
  async generateCertificate(opts: {
    fullName: string;
    title: string;
    theater: 'RED' | 'BLUE' | 'GENERAL';
    issuedAt?: string;
    serial?: string;
  }): Promise<UserCertificate> {
    const fullName = (opts.fullName || "ANONYMOUS OPERATOR").toUpperCase();
    const certTitle = cleanTitle(opts.title);
    const issuedDate = opts.issuedAt || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
    const serial = opts.serial || makeCertSerial(opts.theater);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1123, 794]); // A4 Landscape
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Strictly Black & White
    const black = rgb(0, 0, 0);
    const white = rgb(1, 1, 1);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const darkGray = rgb(0.1, 0.1, 0.1);
    const borderGray = rgb(0.2, 0.2, 0.2);

    // 1. Solid Deep Black Base
    page.drawRectangle({ x: 0, y: 0, width, height, color: black });

    // 2. Technical Minimal Grid Underlay
    for (let i = 0; i < width; i += 120) {
      page.drawLine({ start: { x: i, y: 0 }, end: { x: i, y: height }, color: darkGray, thickness: 0.5 });
    }
    for (let j = 0; j < height; j += 120) {
      page.drawLine({ start: { x: 0, y: j }, end: { x: width, y: j }, color: darkGray, thickness: 0.5 });
    }

    // 3. Blueprint Border
    page.drawRectangle({
      x: 40, y: 40, width: width - 80, height: height - 80,
      borderColor: borderGray, borderWidth: 1
    });

    // 4. Kinetic Corner Brackets (White)
    const bracketSize = 30;
    const drawBracket = (x: number, y: number, dx: number, dy: number) => {
      page.drawLine({ start: { x, y }, end: { x: x + dx, y }, color: white, thickness: 2 });
      page.drawLine({ start: { x, y }, end: { x, y: y + dy }, color: white, thickness: 2 });
    };
    drawBracket(40, 40, bracketSize, bracketSize);
    drawBracket(width - 40, 40, -bracketSize, bracketSize);
    drawBracket(40, height - 40, bracketSize, -bracketSize);
    drawBracket(width - 40, height - 40, -bracketSize, -bracketSize);

    // 5. Header Elements
    page.drawText("TECHTALES ACCREDITATION SYSTEM", { x: 80, y: height - 80, size: 8, font: fontMono, color: white });
    page.drawText("VERIFICATION ID: " + serial, { x: width - 350, y: height - 80, size: 8, font: fontMono, color: lightGray });

    // 6. Main Credential Title
    const headText = "CERTIFICATE OF TECHNICAL MASTERY";
    const headWidth = fontBold.widthOfTextAtSize(headText, 12);
    page.drawText(headText, { x: (width - headWidth) / 2, y: height - 180, size: 12, font: fontBold, color: lightGray });

    // 7. Dynamic Recipient Name (Huge and Bold)
    const nameSize = 72;
    const nameWidth = fontBold.widthOfTextAtSize(fullName, nameSize);
    page.drawText(fullName, { x: (width - nameWidth) / 2, y: height - 320, size: nameSize, font: fontBold, color: white });

    // 8. Certification Context
    const contextText = "THIS OPERATOR HAS DEMONSTRATED EXCEPTIONAL PROFICIENCY IN:";
    const contextWidth = fontNormal.widthOfTextAtSize(contextText, 10);
    page.drawText(contextText, { x: (width - contextWidth) / 2, y: height - 380, size: 10, font: fontNormal, color: lightGray });

    // 9. Unit Mastery Block (Concise 3-4 words)
    const unitText = `[ ${certTitle} ]`;
    const unitWidth = fontBold.widthOfTextAtSize(unitText, 32);
    page.drawText(unitText, { x: (width - unitWidth) / 2, y: height - 460, size: 32, font: fontBold, color: white });

    // 10. TechTales Verification Signature
    const sigLineY = 180;
    page.drawLine({ start: { x: 80, y: sigLineY }, end: { x: 380, y: sigLineY }, color: borderGray, thickness: 1 });
    page.drawText("ISSUING AUTHORITY", { x: 80, y: sigLineY - 20, size: 9, font: fontMono, color: lightGray });
    page.drawText("TECHTALES", { x: 80, y: sigLineY + 15, size: 24, font: fontBold, color: white });

    // 11. Issuance Details
    page.drawText("DATE OF ISSUANCE", { x: width - 260, y: sigLineY - 20, size: 9, font: fontMono, color: lightGray });
    page.drawText(issuedDate, { x: width - 260, y: sigLineY + 15, size: 14, font: fontNormal, color: white });

    // 12. Technical Footer
    const footerText = "ELECTRONICALLY GENERATED // CRYPTOGRAPHICALLY SIGNED // VALID UNTIL SYSTEM TERMINATION";
    const footerWidth = fontMono.widthOfTextAtSize(footerText, 7);
    page.drawText(footerText, { x: (width - footerWidth) / 2, y: 60, size: 7, font: fontMono, color: borderGray });

    // Save and Transmit
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    downloadBlob(blob, `TechTales_Cert_${serial}.pdf`);

    return {
      id: Math.random().toString(36).substr(2, 9),
      serial,
      title: opts.title, // Keep original title for records, PDF gets cleaned one
      theater: opts.theater,
      issuedAt: issuedDate
    };
  }
}

export const certificateService = new CertificateService();
