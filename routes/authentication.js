var express = require('express');
var router = express.Router();
var cors = require('cors')
const {patientRegister, patientLogin, doctorRegister, doctorLogin} = require('../services/authentication.service')
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client();

router.use(cors(
  {
    origin: '*'
  }
))

router.post('/add-patient',async(req,res)=>{
  let body = req.body
  try {
    let response = await patientRegister(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})

router.post('/login',async(req,res)=>{
  let body = req.body
  try {
    let response = await patientLogin(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})

router.post('/doctorlogin',async(req,res)=>{
  let body = req.body
  try {
    let response = await doctorLogin(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})

router.post('/add-doctor',async(req,res)=>{
  let body = req.body
  try {
    let response = await doctorRegister(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})


module.exports = router;