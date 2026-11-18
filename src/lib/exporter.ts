import { jsPDF } from "jspdf";
import { POSTCARD_MM } from "@/lib/geometry";
import type { CardOrientation } from "@/types/card";

export type ExportFormat = "png" | "jpeg" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  includeBleed: boolean;
  jpegQuality: number;
  fileName: string;
  orientation: CardOrientation;
}

function triggerDownload(url: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * ステージから書き出した高解像度DataURLを指定形式でダウンロードする。
 */
export function exportCardFromDataUrl(
  dataUrl: string,
  options: ExportOptions
): void {
  const { format, includeBleed, fileName, orientation } = options;

  if (format === "png" || format === "jpeg") {
    triggerDownload(dataUrl, `${fileName}.${format}`);
    return;
  }

  const bleedExtra = includeBleed ? POSTCARD_MM.bleed * 2 : 0;
  const baseW =
    orientation === "portrait" ? POSTCARD_MM.width : POSTCARD_MM.height;
  const baseH =
    orientation === "portrait" ? POSTCARD_MM.height : POSTCARD_MM.width;

  const pageW = baseW + bleedExtra;
  const pageH = baseH + bleedExtra;

  const pdf = new jsPDF({
    orientation: orientation === "portrait" ? "portrait" : "landscape",
    unit: "mm",
    format: [pageW, pageH],
    compress: true,
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
  pdf.save(`${fileName}.pdf`);
}
