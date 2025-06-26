

const API = {
    mongoConnectionUrl: "mongodb+srv://sarathsr55:sarathsr55@cloudnexusdev.nqsoizw.mongodb.net/?retryWrites=true&w=majority&appName=CloudNexusDev"
}


module.exports = {
    mongoConfig: {
        connectionUrl: API.mongoConnectionUrl,
        database: 'Cardio_demo',
        collections: {
            Patients: 'Patients',
            Doctors: 'Doctors',
            ADMIN:'Admin',
            Appointments:'Appointments'
        }
    },
    tokenSecret:'Cardio_secret'
}