import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name :{
        type : String,
        required : true
    },
    instituteName :{
        type : String,
        required : true
    },
    courseName :{
        type : String,
        required : true
    },
    grade :{
        type : String,
        required : true
    },
   verificationId: {
  type: String,
  unique: true,
  index: true,
  required: true
},
pdfPath:{
    type: String
}
}, {timestamps:true,versionKey: false})

const Certificate = mongoose.model("Certificate", CertificateSchema)

export default Certificate