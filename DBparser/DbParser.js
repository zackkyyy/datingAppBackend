var admin = require ("firebase-admin")
var serviceAccount= require('../adminsdk.json')

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL : 'http://soviet-hinder.firebaseio.com'
})

var db = admin.database()
var ref = db.ref('restricted_access/secret_doucument')

ref.once('value', function (a) {
    console.log(a.val())
})

module.exports = db;