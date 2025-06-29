const MongoDB = require('./mongodb.service')
const { mongoConfig, tokenSecret } = require('../config');
const { Timestamp } = require('mongodb');
const { ObjectID } = require('bson');

const createChat = async (chat) => {
    console.log(chat);
    const chatObject = {
        members: [chat?.senderId, chat?.receiverId],
        time : new Date()
    }
    const isChat = await MongoDB.db.collection(mongoConfig.collections.CHAT).find({ members: { $all: [chat?.senderId, chat?.receiverId] } }).next()
    if (!isChat) {
        const response = await MongoDB.db.collection(mongoConfig.collections.CHAT).insertOne(chatObject)
        if (response) {
            console.log(response?.insertedId.toHexString());
            return {
                status: true,
                message: 'chat created successfully',
                chatId: response?.insertedId.toHexString()
            }
        } else {
            console.log('error occured while creating chat');
            return {
                error : 'error occured while creating chat'
            }
        }
    }else{
        return {
            status: false,
            message : 'chat exists'
        }
    }

}
const createAppointment = async (appointment) => {
    const appointmentObject = {
        members: [appointment?.doctorId, appointment?.patientId],
        apt_date: appointment?.date,
        apt_time: appointment?.time,
        doctorName: appointment?.doctorName,
        patientName: appointment?.patientName,
        specialist: appointment?.specialist,
        doctorImg: appointment?.doctorImg,
        dCallStatus:false,
        pcallStatus:false,
        time : new Date().toLocaleDateString('en-GB')
    }
    
        const response = await MongoDB.db.collection(mongoConfig.collections.Appointments).insertOne(appointmentObject)
        if (response) {
            return {
                status: true,
                message: 'appointment created successfully',
                appointmentId: response?.insertedId.toHexString()
            }
        } else {
            return {
                error : 'error occured while creating chat'
            }
        }
    

}
const findAppointmentByIdAndUpdate = async (appointment) =>{
    const response = await MongoDB.db.collection(mongoConfig.collections.Appointments).findOneAndUpdate({_id : ObjectID(appointment?._id)},{$set:{dCallStatus:appointment?.dCallStatus,pCallStatus:appointment?.pCallStatus,time: new Date().toLocaleDateString('en-GB')}})
    if(response?.lastErrorObject?.updatedExisting){
        return {
            status: true,
            message: 'Updated successfully'
        }
    }else{
        return {
            error: 'Error occured'
        }
    }
}
const getAppointmentById = async(id)=>{
    const response = await MongoDB.db.collection(mongoConfig.collections.Appointments).findOne({_id:new ObjectID(id)})
    
    if(response){
        return {
            status : true,
            data : response
        }
    }else{
        console.log(`error while fetching data`);
    }
}

const userChat = async (chat) => {
    const response = await MongoDB.db.collection(mongoConfig.collections.CHAT).find({ members: { $in: [chat] } }).toArray()
    if (response) {
        return {
            status: true,
            message: 'chat found successfully',
            chat: response
        }
    } else {
        console.log('error occured while finding chat');
    }
}
const userAppointments = async (userId) => {
    const response = await MongoDB.db.collection(mongoConfig.collections.Appointments).find({ members: { $in: [userId] } }).toArray()
    if (response) {
        return {
            status: true,
            message: 'appointments found successfully',
            appointment: response
        }
    } else {
        return('error occured while finding chat') 
    }
}

const deleteChat = async (id)=>{
    
    try {
        const response = await MongoDB.db.collection(mongoConfig.collections.CHAT).deleteOne({_id:ObjectID(id)})
        if(response){
            const deletemsgs = await MongoDB.db.collection(mongoConfig.collections.MESSAGES).deleteMany({chatId:id})
            console.log(deletemsgs);
            
            return response
        }
    } catch (error) {
        console.log(`error occured : ${error}`);
        
    }
}

const findChatByIdAndUpdate = async (id) =>{
    const response = await MongoDB.db.collection(mongoConfig.collections.CHAT).findOneAndUpdate({_id : ObjectID(id)},{$set:{time: new Date()}})
    if(response){
        console.log(response);
        
    }
}

const findChat = async (id1, id2) => {
    const response = await MongoDB.db.collection(mongoConfig.collections.CHAT).find({ members: { $all: [id1, id2] } }).next()
    if (response) {
        return {
            ststus: true,
            message: 'chat found successfully',
            chat: response
        }
    } else {
        return {
            status: false,
            message: 'no chat found'
        }
    }
}

module.exports = { createChat, userChat, findChat, findChatByIdAndUpdate, deleteChat, createAppointment,userAppointments,findAppointmentByIdAndUpdate,getAppointmentById }