let db = require('../DBparser/DbParser')
let crypto = require('crypto')
let ThisSalt = process.env.SALT
let thisHash = '';

var database = db.admin.firestore()
const userCollectionRef = database.collection('users');

setPassword = function (password) {
    return thisHash = crypto.pbkdf2Sync(password, ThisSalt,
        1000, 64, `sha512`).toString(`hex`)
}
validPassword = function (passwordInDatabase, password) {
    var hash = crypto.pbkdf2Sync(password,
        ThisSalt, 1000, 64, `sha512`).toString(`hex`)
    console.log(hash)
    return passwordInDatabase === hash
}
const createUser = async (req, res) => {
    let user = {
        first: (req.body.firstName || ""),
        last: (req.body.lastName || ""),
        userName: (req.body.userName || ""),
        password: setPassword(req.body.password),
        email: (req.body.email || ""),
        dateOfBirth: (req.body.dateOfBirth || ""),
        description: (req.body.description || ""),
        title: (req.body.title || ""),
        age: (req.body.age || ""),
        image: (req.body.image || ""),
        gender : (req.body.gender || "")
    }

    userCollectionRef.add(user).then(ref => {
        console.log('200')
    }).catch(err => {
        console.log(err)
    })
    res.send('200')
}
const updateUser = async (req, res) => {
    if (req.session.id == req.body.user_id){
        console.log(req.params.user_id)
        let id = req.params.user_id
        let user = {
            first: (req.body.firstName || ""),
            last: (req.body.lastName || ""),
            userName: (req.body.userName || ""),
            dateOfBirth: (req.body.dateOfBirth || ""),
            description: (req.body.description || ""),
            title: (req.body.title || ""),
            image: (req.body.image || ""),
            gender:(req.body.gender|| "")
        }
        userCollectionRef.doc(id).update(user)
            .then(ref => {
                console.log(200)
            }).catch(res.send(404))
    }
}
const deleteAllUsers = async (req, res) => {
    userCollectionRef.listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
        res.send('done')
    })
}
const logOut = async (req,res)=>{
    console.log('here')
    req.session.loggedin= false
    console.log(req.session.loggedin)
    req.session.destroy()
    res.sendStatus(200)
}
const validateSignIn = async (req, res) => {
    let found = false;
    let email = req.body.email
    let password = req.body.password
    let allusers = userCollectionRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().email === email) {
                    found = true;
                    console.log('found')
                    if (validPassword(doc.data().password, password)) {
                        req.session.id = doc.id
                        req.session.username = doc.data().email
                        req.session.loggedin = true
                        console.log(req.session)
                        res.status(200).send({
                            userId : doc.id,
                            username : doc.data().userName
                        })

                    } else {
                        res.status(500).send({
                            message : 'Wrong password'
                        })
                    }
                }
            });
            if (!found) {
                console.log('not found')
                res.status(500).send({
                    message : 'User does not exist'
                })
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

    let user = userCollectionRef.where("email", "=", email).get()

}
const getAllUsers = async (req, res) => {
    let tempArray = [];
    console.log(req.session)
    userCollectionRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc.data())
        });
        res.send(tempArray);
    });
}
const findUser = async (req, res) => {
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
    getAllUsers,
    validateSignIn,
    logOut
}