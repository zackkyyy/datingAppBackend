let express = require('express');
let router = express.Router();
let database = require('../DBparser/DbParser.js')
let crypto = require('crypto')
let createUser =require('../conrollers/authcontroller')

const userCollectionRef = database.collection('users');

/* GET users listing. */
router.route('/').get(function (req, res, next) {
    let tempArray = [];
    userCollectionRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        });
        res.send(tempArray);
    });
});

router.route('/createTest').post(createUser)



router.route('/create').post(function (req, res) {
    console.log(req.body.firstName)
    let user = {
        first: (req.body.firstName|| ""),
        last: (req.body.lastName|| ""),
        userName: (req.body.userName|| ""),
        email: (req.body.email|| ""),
        dateOfBirth: (req.body.dateOfBirth|| ""),
        description: (req.body.description|| ""),
        title: (req.body.title|| ""),
        age: (req.body.age|| ""),
        image: (req.body.image|| "")
    }

    console.log(user)
    let user1={
        name : "zacky",
        last : "last "
    }

  userCollectionRef.add(user).then(ref => {
    console.log('200')
  }).catch(err => {
    console.log(err)
  })
  res.send('200')
})

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
router.route('/find/:findBy/:searchWord').get(function (req, res) {
    switch (req.params.findBy) {
        case 'id':
            let id = req.params.searchWord
            userCollectionRef.doc(id).get().then(doc => {
                if (!doc.exists) {
                    console.log('User is not exist')
                    res.redirect('/users')
                } else {
                    console.log(doc.data())
                    res.send(doc.data())
                }
            }).catch(err => {
                console.log(err)
            })
            break;
        case 'name' :
            console.log('name')
            break;
        default:
            break;


    }

})


router.route('/update/:user_id').post(function (req, res) {
    let id = req.params.user_id
    userCollectionRef.doc(id).update({first: 'Zack'})
        .then(ref => {
            console.log(200)
        }).catch(res.send(404))
})


router.route('/deleteAll').post(function (req, res) {
    userCollectionRef.listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
    })
})

module.exports = router;
