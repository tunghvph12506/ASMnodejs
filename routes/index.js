var express = require('express');
var router = express.Router();
var dbConnect='mongodb+srv://hieunv111:duyduy123@cluster0.j0kjh.mongodb.net/AppTinder?retryWrites=true&w=majority';
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
          res.redirect('./trangchu')
        }
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
module.exports = router;
