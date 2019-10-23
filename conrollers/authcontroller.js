let admin = require('firebase-service')

 const createUser = async (req, res) => {
    // const {
    //     email,
    //     phoneNumber,
    //     password,
    //     firstName,
    //     lastName
    // } = req.body;
     let email = "email"
     let phoneNumber = "Sddsd"
     let password = "password"

    const user = await admin.auth().add({
        email : "email",
        password: "password",
        name : "name"
    });

    return res.send(user);
}


module.exports= createUser;