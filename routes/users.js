let express = require('express');
let router = express.Router();
let database = require('../DBparser/DbParser.js')
let userController =require('../conrollers/userController')

const userCollectionRef = database.collection('users');

/* GET users listing. */
router.route('/').get(userController.getAllUsers);
router.route('/createTest').post(userController.createUser)
router.route('/create').post(userController.createUser)
router.route('/update/:user_id').post(userController.updateUser)
router.route('/find/:findBy/:searchWord').get(userController.findUser)
router.route('/deleteAll').get(userController.deleteAllUsers)
router.route('/validateSignIn').post(userController.validateSignIn)
router.route('/logOut').get(userController.logOut)

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





module.exports = router;
