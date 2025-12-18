import qr from "qr-image";

const generateQRBuffer = (text) => {
  return qr.imageSync(text, { type: "png" });
};


export default generateQRBuffer;