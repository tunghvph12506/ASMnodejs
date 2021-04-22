var express = require('express');
var router = express.Router();
var dbConnect='mongodb+srv://admin:admin@cluster0.axqha.mongodb.net/tinderasm?retryWrites=true&w=majority';
const  mongoose =require('mongoose');
mongoose.connect(dbConnect,{useNewUrlParser:true,useUnifiedTopology:true});

const  db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function (){
  console.log('connection')
});


var multer=require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    var chuoi=file.originalname;
    var duoi=file.originalname.slice(chuoi.length-4,chuoi.length);
    if(duoi=='.jpg'){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+duoi)
    }else {
      cb('khong phải file jpg',null)
    }
  }
})
var upload1=multer({
  storage:storage,
}).single('avatar11')


router.get('/', function(req, res, next) {
  res.render('index')
});
var user=new mongoose.Schema(
    {
      userName:String,
      email:String,
      password:String,
      sdt:String,
      avatar:String,
    }
)
router.get('/getUsers', function (req, res) {
  var connectUsers = db.model('users', user);
  var baseJson = {
    errorCode: undefined,
    errorMessage: undefined,
    data: undefined
  }
  connectUsers.find({}, function (err, users) {
    if (err) {
      baseJson.errorCode = 403
      baseJson.errorMessage = '403 Forbidden'
      baseJson.data = []
    } else {
      baseJson.errorCode = 200
      baseJson.errorMessage = 'OK'
      baseJson.data = users
    }
    res.send(baseJson);
  })

})
router.post('/',function (req,res){
  var userConnect=db.model('users',user);
  upload1(req, res, function (err){
    if(err){
      console.log(err)
      return;
    }else {
      userConnect({
        userName:req.body.usernameDK,
        email:req.body.emailDK,
        password:req.body.passwordDK,
        sdt:req.body.sdtDK,
        avatar:req.file.filename,
      }).save(function (err) {
        if(err){
          res.render('index',{title:'Express :err'})
        }else {
          res.send({token})
          res.redirect('./trangchu')
        }
      }).then(data =>{
        console.log(data)
        res.send(data)
      }).catch(err => {
        console.log(err)
      })
    }
  });
})
router.get('/trangchu',function (req,res) {
  var userConnect1=db.model('users',user);
  userConnect1.find({},function (err,users) { //lay tat ca
    if(err){
      res.render('trangchu',{title:'Express :err'+err})
    }
    res.render('trangchu',{title:'Express :Success',users:users})
  })
})



router.get('/deleteUsers/:id',function (req,res) {

  db.model('users',user).deleteOne({ _id: req.params.id}, function (err) {
    if (err) {
      console.log('Lỗi')
    }

    res.redirect('../trangchu')

  });
})


router.get('/updateUser/:id',function (req,res) {
  console.log('id:'+req.params.id)
  db.model('users',user).findById(req.params.id,function (err,data) {
    if(err){
      console.log("loi")
    }else {
      res.render("updateUser",{dulieu: data})

    }
  })
})
router.post('/updateUser',function (req,res) {
  var userConnect=db.model('users',user);
  console.log('name:'+req.body._id)

  upload1(req, res, function (err){
    if(err){
      console.log(err)

    }else {
      if(!req.file){
        console.log('name:'+req.body.userNameUd)
        userConnect.updateOne(req.body._id,{
          userName:req.body.userNameUd,
          email:req.body.emailUd,
          sdt:req.body.sdtUd,
        },function (err) {
          if(err){
            console.log(err)
          }else {
            res.redirect('../trangchu')
          }
        }  )
      }else {

        console.log('name2:'+req.body.userNameUd)
        userConnect.updateOne(req.body._id,{

          userName:req.body.usernameDK,
          email:req.body.emailDK,
          sdt:req.body.sdtDK,
          avatar:req.file.filename,
        },function (err) {
          if(err){
            console.log(err)
          }else {
            res.redirect('../trangchu')
          }
        }  )
      }
    }

  });



})


router.post('/update',(req,res) =>{
  var userConnect=db.model('users',user);
  userConnect.updateOne(req.body._id,{
    userName:req.body.usernameDK,
    email:req.body.emailDK,
    sdt:req.body.sdtDK,
    avatar:req.file.filename,
  }).then(data =>{
    console.log(data)
    res.send(data)
  }).catch(err => {
    console.log("error",err)
  })
})

router.post("/users", async (req, res) => {
  var userConnect=db.model('users',user);
  const u = new userConnect(req.body);
  try {
    await u.save();
    res.send(u);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/delete11", (req, res) => {
  db.model('users',user).findByIdAndRemove(req.body.id)
      .then((data) => {
        console.log(data);
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
});
router.post("/update12", (req, res) => {
  db.model('users',user).findByIdAndUpdate(req.body.id, {
    userName:req.body.userName,
    email:req.body.email,
    password:req.body.password,
    sdt:req.body.sdt,
  })
      .then((data) => {
        console.log(data);
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
});
module.exports = router;
