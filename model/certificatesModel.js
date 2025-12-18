import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
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
    createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Certificate = mongoose.model("Certificate", CertificateSchema)

export default Certificate