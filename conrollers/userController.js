let admin = require('firebase-service')
let database = require('../DBparser/DbParser')
let crypto = require('crypto')
let ThisSalt = process.env.SALT
let thisHash = '';
const userCollectionRef = database.collection('users');

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

//this.hash = crypto.pbkdf2Sync(doc.data().password ,this.salt , 1000,64  ,`sha512`).toString(`hex`)

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
        image: (req.body.image || "")
    }

    userCollectionRef.add(user).then(ref => {
        console.log('200')
    }).catch(err => {
        console.log(err)
    })
    res.send('200')
}

const updateUser = async (req, res) => {
    let id = req.params.id
    let user = {
        first: (req.body.firstName || ""),
        last: (req.body.lastName || ""),
        userName: (req.body.userName || ""),
        email: (req.body.email || ""),
        dateOfBirth: (req.body.dateOfBirth || ""),
        description: (req.body.description || ""),
        title: (req.body.title || ""),
        image: (req.body.image || "")
    }
    userCollectionRef.doc(id).update(user)
        .then(ref => {
            console.log(200)
        }).catch(res.send(404))
}
const deleteAllUsers = async (req, res) => {
    userCollectionRef.listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
        res.send('done')
    })
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
                        res.sendStatus(200)
                    } else {
                        res.send('password wrong')
                    }
                }
            });
            if (!found) {
                console.log('not found')
                res.send('not found')
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

    let user = userCollectionRef.where("email", "=", email).get()

}
const getAllUsers = async (req, res) => {
    let tempArray = [];
    userCollectionRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc.data())
            console.log(validPassword('password'))
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
    validateSignIn
}