import puppeteer from "puppeteer";

const generatePDF = async (html, fileName = "document.pdf") => {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return {
    buffer: pdfBuffer,
    fileName
  };
};

export default generatePDF;