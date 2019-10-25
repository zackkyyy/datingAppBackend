let express = require('express');
let router = express.Router();
let db = require('../DBparser/DbParser.js')

const database = db.admin.firestore()
const userCollectionRef = database.collection('users');

router.route('/').get(function (req, res) {
    res.send("this is relations.js router")
})

router.route('/getMatches/:user_id').get(function (req, res) {
    let tempArray = [];
    let id = req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('matches')
    matchesSubCollection.get()
        .then(function (result) {
        result.forEach((doc)=> {
            tempArray.push(doc.data())
        })
        res.send(tempArray)
    })
})


router.route('/getLove').post(function (req, res) {
    let id = req.body.userID
    let array = []
    var BreakException = {};
    try {
    userCollectionRef.get()
        .then((list) => {
            list.forEach(function (doc) {
                userCollectionRef
                    .doc(id)
                    .collection('swiped')
                    .get()
                    .then((listofSwiped) => {
                        listofSwiped.docs.forEach((document) => {
                            if (document.data().id != doc.id) {
                                userCollectionRef.doc(doc.id)
                                    .get()
                                    .then((doc) => {
                                            res.send(doc.data())
                                            throw BreakException
                                    })
                            }
                        })
                    })
            })
        })
        .then(() => {
            console.log('array' + array)
        })
}
catch (e) {
        console.log('error')
        if (e !== BreakException) throw e;
    }
})


router.route('/getLikes/:user_id').get(function (req, res) {
    let tempArray = [];
    let id = req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('likes')
    matchesSubCollection.get().then(function (result) {
        result.forEach(function (doc) {
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        })
        res.send(tempArray)
    })
})


router.route('/getDisliked/:user_id').get(function (req, res) {
    let tempArray = [];
    let id = req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('disliked')
    matchesSubCollection.get().then(function (result) {
        result.forEach(function (doc) {
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        })
        res.send(tempArray)
    })
})


module.exports = router