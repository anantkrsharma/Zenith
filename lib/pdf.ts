export async function downloadPdf(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("The document is not ready to export.");
  const { default: html2pdf } = await import("html2pdf.js");
  await html2pdf()
    .set({
      margin: [0, 10],
      filename,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
}
