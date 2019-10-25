let express = require('express');
let router = express.Router();
let db = require('../DBparser/DbParser.js')
let userController =require('../conrollers/userController')
const Multer = require('multer')


const database = db.admin.firestore()
const bucket = db.storage.bucket('gs://soviet-hinder.appspot.com')
//const bucket  = Projectbucket.file('images')

const userCollectionRef = database.collection('users');

/* GET users listing. */
router.route('/').get(userController.getAllUsers);
router.route('/createTest').post(userController.createUser)
router.route('/create').post(userController.createUser)
router.route('/update/').post(userController.updateUser)
router.route('/find/:findBy/:searchWord').get(userController.findUser)
router.route('/deleteAll').get(userController.deleteAllUsers)
router.route('/validateSignIn').post(userController.validateSignIn)
router.route('/logout').get(userController.logOut)
router.route('/this').get(function (req, res) {
    let subColl = userCollectionRef.doc('1rOnF8MYQ4jx2zY6rXyc').collection('matches')
    let tempArray = [];

    subColl.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        });
        res.send(tempArray);
    });
})


const multer = Multer({
    storage: Multer.memoryStorage(),
});



//
// const  upload = Multer({
//     dest:'./uploads'
// })

router.post('/upload',multer.single('file'), (req,res)=>{
    console.log('Uploading Image .....');
    let file = req.file
    if(file){
        uploadImageToStorage(file, req).then((success)=>{
            res.sendStatus(200)
        }).catch((err)=>{
            console.log(err)
        })
    }
})


/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file, req) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        console.log(req.session)
        let newFileName = req.session.userID+ "_" +req.session.username ;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });


        blobStream.end(file.buffer);
    });
}

module.exports = router;
