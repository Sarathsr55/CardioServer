const MongoDB = require('./mongodb.service')
const { mongoConfig, tokenSecret } = require('../config')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('../routes/authentication')
const { ObjectID } = require('bson')
const axios = require('axios')

const patientRegister = async (patient) => {
    try {
        const encryptedPass = await bcrypt.hash(patient?.password, 12)
        let patientObject = {
            patientName: patient?.username,
            email: patient?.email,
            password: encryptedPass,
            lastseen: {
                date: '',
                time: ''
            }
        }
        let savedPatient = await MongoDB.db.collection(mongoConfig.collections.Patients).insertOne(patientObject)
        return savedPatient
    } catch (error) {
        if (error.status === "11000") {
            return res.json({ status: "error", msg: "User already exists" })
        }
        return res.json({ status: "error" })
    }
}

const patientLogin = async(patient) => {
    try {
        let patientObject = {
            email: patient?.email,
            password: patient?.password
        }
        let savedPatient = await MongoDB.db.collection(mongoConfig.collections.Patients).findOne({ email: patient?.email })
        if (!savedPatient) {
            return {
                status: false,
                message: 'no User found with this credentials'
            }
        }else{
            let isPasswordVerified = await bcrypt.compare(patient?.password, savedPatient?.password)
            if(isPasswordVerified){
                let token = await jwt.sign({email:patientObject?.email},tokenSecret)
                const {_id,patientName,email} = savedPatient
                return{
                    status:true,
                    message: 'Login Successfull',
                    token:token,
                    user:{_id,patientName,email}
                }
            }else{
                return{
                    status:false,
                    message:'User login failed'
                }
            }
        }
    } catch (error) {
        return error
    }
}
const doctorLogin = async(doctor) => {
    try {
        let doctorObject = {
            userId: doctor?.userId,
            password: doctor?.password
        }
        let savedDoctor = await MongoDB.db.collection(mongoConfig.collections.Doctors).findOne({ userId: doctor?.userId })
        if (!savedDoctor) {
            return {
                status: false,
                message: 'no User found with this credentials'
            }
        }else{
            let isPasswordVerified = await bcrypt.compare(doctor?.password, savedDoctor?.password)
            if(isPasswordVerified){
                let token = await jwt.sign({userId:doctorObject?.userId},tokenSecret)
                const {_id,userId,doctorName,specialist} = savedDoctor
                return{
                    status:true,
                    message: 'Login Successfull',
                    token:token,
                    user:{_id,userId,doctorName,specialist}
                }
            }else{
                return{
                    status:false,
                    message:'User login failed'
                }
            }
        }
    } catch (error) {
        return error
    }
}

const doctorRegister = async (doctor) => {
    try {
        const encryptedPass = await bcrypt.hash(doctor?.password, 12)
        let doctorObject = {
            doctorName: doctor?.username,
            userId: doctor?.userId,
            department: doctor?.department,
            password: encryptedPass,
            img: doctor?.img,
            lastseen: {
                date: '',
                time: ''
            }
        }
        let savedDoctor = await MongoDB.db.collection(mongoConfig.collections.Doctors).insertOne(doctorObject)
        return savedDoctor
    } catch (error) {
        if (error.status === "11000") {
            return res.json({ status: "error", msg: "User already exists" })
        }
        return res.json({ status: "error" })
    }
}






module.exports = { patientRegister,patientLogin,doctorRegister,doctorLogin }