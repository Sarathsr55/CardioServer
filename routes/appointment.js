const express = require('express')
const { createChat, userChat, findChat, deleteChat, createAppointment, userAppointments } = require('../services/appointment')
const router = express.Router()

router.post('/', async(req,res,next)=>{
    const body = req.body
    try {
        const response = await createChat(body)
        if(response){
            res.json(response)
        }
    } catch (error) {
            console.log(`error occured while creating chat : ${error}`);
    }
})

router.post('/add', async(req,res,next)=>{
    const body = req.body
    try {
        const response = await createAppointment(body)
        if(response){
            res.json(response)
        }
    } catch (error) {
            res.json(`error occured while creating chat : ${error}`);
    }
})

router.get('/:userId', async(req,res)=>{
    const body = req.params.userId
    try {
        const response = await userAppointments(body)
        if(response){
            res.json(response)
        }
    } catch (error) {
        return(`error occured while finding chat : ${error}`);
    }
})

router.get('/find/:firstId/:secondId', async(req,res)=>{
    const id1 = req.params.firstId
    const id2 = req.params.secondId
    try {
        const response = await findChat(id1,id2)
        if(response){
            res.json(response)
        }
    } catch (error) {
        console.log(`error occured while finding chat : ${error}`);
    }

})

router.delete('/deletechat',async(req,res)=>{
    
    let id = req.body?._id
    try {
        let result = await deleteChat(id)
        if(result){
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;