let admin = require('firebase-service')
let database = require('../DBparser/DbParser')

const userCollectionRef = database.collection('users');

 const createUser = async (req, res) => {
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

     userCollectionRef.add(user).then(ref => {
         console.log('200')
     }).catch(err => {
         console.log(err)
     })
     res.send('200')
}

const updateUser = async (req,res) =>{
    let id = req.params.id
        let user = {
        first: (req.body.firstName|| ""),
        last: (req.body.lastName|| ""),
        userName: (req.body.userName|| ""),
        email: (req.body.email|| ""),
        dateOfBirth: (req.body.dateOfBirth|| ""),
        description: (req.body.description|| ""),
        title: (req.body.title|| ""),
        image: (req.body.image|| "")
    }
    userCollectionRef.doc(id).update(user)
        .then(ref => {
            console.log(200)
        }).catch(res.send(404))
}
const deleteAllUsers =async (req,res) =>{
    userCollectionRef.listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
    })
}
const getAllUsers = async (req, res)=>{
    let tempArray = [];
    userCollectionRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc.data())
            console.log(doc.id, " => ", doc.data());
        });
        res.send(tempArray);
    });
}
const findUser = async (req, res)=>{
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
}

module.exports = {
    createUser,
    updateUser,
    findUser,
    deleteAllUsers,
    getAllUsers
}