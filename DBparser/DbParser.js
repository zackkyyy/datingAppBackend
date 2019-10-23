let admin = require ("firebase-admin")
let serviceAccount= require('../adminsdk.json')
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
})
let db = admin.firestore()

module.exports = db;