let express = require('express');
let router = express.Router();
let database = require('../DBparser/DbParser.js')
const userCollectionRef = database.collection('users');

router.route('/').get(function (req,res) {
    res.send("this is relations.js router")
})

router.route('/getMatches/:user_id').get(function (req,res) {
    let tempArray = [];
    let id =req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('matches')
    matchesSubCollection.get().then(function ( result) {
        result.forEach(function (doc) {
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        })
        res.send(tempArray)
    })
})


router.route('/getLikes/:user_id').get(function (req,res) {
    let tempArray = [];
    let id =req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('likes')
    matchesSubCollection.get().then(function ( result) {
        result.forEach(function (doc) {
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        })
        res.send(tempArray)
    })
})


router.route('/getDisliked/:user_id').get(function (req,res) {
    let tempArray = [];
    let id =req.params.user_id
    let matchesSubCollection = userCollectionRef.doc(id).collection('disliked')
    matchesSubCollection.get().then(function ( result) {
        result.forEach(function (doc) {
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        })
        res.send(tempArray)
    })
})


module.exports = router