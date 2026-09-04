/**
 * Generates a crisp PDF document from a DOM element using dynamically imported html2canvas & jsPDF.
 * Dynamic imports keep initial JS hydration bundle minimal and lightning fast.
 * Supports multi-page pagination for documents with 20+ line items or long notes.
 * No data is uploaded or transmitted to any server.
 */
export async function downloadElementAsPDF(
  elementId: string,
  filename: string = 'document.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF generation.`);
  }

  // Dynamic import on demand when user clicks "Download PDF"
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const html2canvas = html2canvasModule.default;
  const jsPDF = jsPDFModule.jsPDF;

  // Render element to high-DPI canvas
  const canvas = await html2canvas(element, {
    scale: 2, // High DPI resolution for crisp text & borders
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginX = 8; // 8mm left/right margin
  const marginY = 8; // 8mm top/bottom margin
  const printableWidth = pageWidth - marginX * 2;
  const printableHeight = pageHeight - marginY * 2;

  const imgWidth = printableWidth;
  const imgHeight = (canvas.height * printableWidth) / canvas.width;

  const imgData = canvas.toDataURL('image/png');

  // Check if content exceeds single page
  if (imgHeight <= printableHeight) {
    // Single page document
    pdf.addImage(
      imgData,
      'PNG',
      marginX,
      marginY,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
  } else {
    // Multi-page document pagination slice algorithm
    let heightLeft = imgHeight;
    let positionY = marginY;

    pdf.addImage(
      imgData,
      'PNG',
      marginX,
      positionY,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      positionY = heightLeft - imgHeight + marginY;
      pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        marginX,
        positionY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= printableHeight;
    }
  }

  pdf.save(filename);
}

/**
 * Triggers standard browser print dialog targeting custom print CSS rules.
 */
export function printDocument(): void {
  window.print();
}
