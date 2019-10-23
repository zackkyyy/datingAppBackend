let express = require('express');
let router = express.Router();
let database = require('../DBparser/DbParser.js')



const userCollectionRef = database.collection('users');

/* GET users listing. */
router.route('/').get( function(req, res, next) {
  let tempArray  =[];
  userCollectionRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      tempArray.push(doc.data())
      console.log(doc.id, " => ", doc.data());
    });
    res.send(tempArray);
  });
});


router.route('/create').post( function (req , res) {
    userCollectionRef.add({
      first  :'Zacky',
      last  :'Kharboutli',
      born : 1990
    })
  res.send('200')
})

router.route('/find/:findBy/:searchWord').get(function (req,res) {
  switch (req.params.findBy) {
    case 'id': let id = req.params.searchWord
      userCollectionRef.doc(id).get().then( doc=>{
        if(!doc.exists){
          console.log('User is not exist')
          res.redirect('/users')
        }else {
          console.log(doc.data())
          res.send(doc.data())
        }
      }).catch(err=>{
        console.log(err)
      })
          break;
    case 'name' : console.log('name')
      break;
    default: break;


  }

})


router.route('/update/:user_id').post(function (req,res) {
  let id = req.params.user_id
  userCollectionRef.doc(id).update({first : 'Zack'})
      .then(ref=> {
        console.log(200)
      }).catch(res.send(404))
})


router.route('/deleteAll').post(function (req, res) {
  userCollectionRef.listDocuments().then(val => {
    val.map((val)=>{
      val.delete()
    })
  })
})

module.exports = router;
