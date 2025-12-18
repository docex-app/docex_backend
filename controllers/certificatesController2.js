import Certificate from "../model/certificatesModel.js";
import generateQRBuffer from "../services/qrCode/qrService.js";
import certificateTemplate from "../services/pdf/templates/certificate.template.js";

//READ

const getCertificates = async (req,res)=>{
    try{
        const allCertificates = await Certificate.find()

        if(!allCertificates || allCertificates.length===0){
            return res.status(404).json({
                success : false,
                message : "No Certificates found !"
            })
        }

        res.status(200).json({
            success : true,
            certificates : allCertificates
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//CREATE

// const createCertificate = async (req,res)=>{
//     try{
//         const {name,instituteName,courseName,grade} = req.body;
//          if (!name || !instituteName || !courseName || !grade) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         const newCertificate = new Certificate({name,instituteName,courseName,grade});
//         await newCertificate.save();


//         res.status(201).json({
//             success : true,
//             message : "Certificate Created Successfully",
//             certificate : newCertificate
//         })

//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }

// }

import mongoose from "mongoose";

const createCertificate = async (req, res) => {
  try {
    const { name, instituteName, courseName, grade } = req.body;

    if (!name || !instituteName || !courseName || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const certificate = await Certificate.create({
      name,
      instituteName,
      courseName,
      grade,
      verificationId: new mongoose.Types.ObjectId().toString()
    });

    res.status(201).json({
      success: true,
      certificate
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

//UPDATE

const updateCertificate = async (req,res)=>{
    try{
        const {id} = req.params;
        const {name,instituteName,courseName,grade} = req.body;
        const updatedCertificate = await Certificate.findByIdAndUpdate(id,{
            name,instituteName,courseName,grade
        }, {new:true})

        if(!updatedCertificate){
           return res.status(404).json({
                success : false,
                message : "Cannot find certificates"
            })
        }

        res.status(200).json({
            success : true,
            certificate : updatedCertificate
        })



    }catch(err){

        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//DELETE
const deleteCertificate = async (req,res)=>{
    try{
        const {id} = req.params;
        const deletedCertificate = await Certificate.findByIdAndDelete(id);
        
        if(!deletedCertificate){
         return res.status(404).json({
            success : false,
            message : "Certificate not found for deletion"
        })
    }

    res.status(200).json({
        success : true,
        message : "Certificate has been deleted Successfully"
    })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}


// PREVIEW CERTIFICATE (HTML only)

const previewCertificate = async (req, res) => {
  try {
    const {
      name,
      instituteName,
      courseName,
      grade
    } = req.body;

    // Basic validation
    if (!name || !instituteName || !courseName || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for preview"
      });
    }

    // Generate QR (verification URL placeholder)
    const verifyUrl = "https://docex.app/verify/demo";
    const qrBuffer = await generateQRBuffer(verifyUrl);
    const qrCodeBase64 = qrBuffer.toString("base64");

    // Build HTML using your template
    const html = certificateTemplate({
      name,
      instituteName,
      courseName,
      grade,
      issuedDate: new Date().toDateString(),
      qrCodeBase64
    });

    res.setHeader("Content-Type", "text/html");
    return res.send(html);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Certificate preview failed",
      error: err.message
    });
  }
};


// DOWNLOAD CERTIFICATE (PDF)

const downloadCertificate = async (req, res) => {
  try {
    const {
      name,
      instituteName,
      courseName,
      grade
    } = req.body;

    if (!name || !instituteName || !courseName || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for download"
      });
    }

    // Generate QR
    const verifyUrl = "https://docex.app/verify/demo";
    const qrBuffer = generateQRBuffer(verifyUrl);
    const qrCodeBase64 = qrBuffer.toString("base64");

    const html = certificateTemplate({
      name,
      instituteName,
      courseName,
      grade,
      issuedDate: new Date().toDateString(),
      qrCodeBase64
    });

    // Puppeteer PDF generation
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=certificate.pdf"
    });

    return res.send(pdfBuffer);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Certificate download failed",
      error: err.message
    });
  }
};





export {getCertificates,createCertificate,updateCertificate,deleteCertificate,downloadCertificate,previewCertificate}