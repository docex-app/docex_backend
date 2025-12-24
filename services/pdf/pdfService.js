import puppeteer from "puppeteer";

const generatePDF = async (html, options={}) => {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ 
    format: "A4",
    printBackground : true,
    ...options     
    //this is being used incase , it will  be used to override anything passed inside options. 
    // E.g. const pdfBuffer = await generatePDFBuffer(html, {landscape: true}
    //options = { landscape: true }

});
 
//console.log("PDF buffer size:", pdfBuffer.length);

  await browser.close();

  return pdfBuffer

    // buffer: pdfBuffer - some bug it seems
    //fileName -> controller will control the file name 


  
};

export default generatePDF;