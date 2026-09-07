declare module "html2pdf.js" {
  interface PdfWorker {
    set(options: object): PdfWorker;
    from(element: HTMLElement): PdfWorker;
    save(): Promise<void>;
  }
  export default function html2pdf(): PdfWorker;
}
