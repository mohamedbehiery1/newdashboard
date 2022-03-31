import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib'
import { saveBlobToFile } from 'src/__utils__/blobUtils';

export const mergePdfs = async (pdfsToMerges) => {
    const mergedPdf = await PDFDocument.create();
    const actions = pdfsToMerges.map(async pdfBuffer => {
        const pdf = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    });
    await Promise.all(actions);
    const mergedPdfFile = await mergedPdf.save();
    return mergedPdfFile;
}

export const generatePDF = async (barCodes, idPrefix, hideMode, fileName, onComplete) => {
    if (!hideMode) return;
    const arr = []
    for (const barcode of barCodes) {
        const selector = `#${idPrefix}${barcode.text}`
        const divToPrint = document.querySelector(selector);
        const canvas = await html2canvas(divToPrint, {
            useCORS: true,
            onclone: function (clonedDoc) {
                if (hideMode === "display")
                    clonedDoc.querySelector(selector).style.display = 'block';
            }
        })
        const imgData = canvas.toDataURL({ format: 'jpeg', });
        const report = new JsPDF({
            orientation: 'p',
            unit: 'pt', // points, pixels won't work properly
            format: [canvas.width * 0.75, canvas.height * 0.75],
            compress: true
        });
        report.addImage(imgData, 'JPEG', 0, 0);
        const arrayBuffer = report.output('arraybuffer');
        arr.push(arrayBuffer);
    }
    const response = await mergePdfs(arr);
    const blob = new Blob([response], { type: "application/pdf" });
    saveBlobToFile(blob, `${fileName}.pdf`);
    onComplete()
}