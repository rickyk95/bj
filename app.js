const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { urlencoded } = require('express');
const User = require('./mongoose/models/User');
const Post = require('./mongoose/models/Post');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const fs = require('fs');
var renderer = require('quilljs-renderer');
const render = require('render-quill');
const path = require('path');
const crypto = require('crypto');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const fileStorageEngine = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images"); //important this is a direct path fron our current file to storage location
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "--" + file.originalname);
//   },
// });

var mongoUri =
  'mongodb+srv://rt:bKhh8FZYYXOJNFJ1@bodhi-journey.hzyub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoUri).then(() => {
  console.log('Successfully connected');
});

var storage = new GridFsStorage({
  url: mongoUri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = req.body.title + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

// var gfs;
const conn = mongoose.createConnection(
  'mongodb+srv://rt:bKhh8FZYYXOJNFJ1@bodhi-journey.hzyub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);

// conn.once('open',()=>{
//     gfs = Grid(conn.db,mongoose.mongo);
//     gfs.collection('uploads')
// })
// connectToMongoose()

var gfs;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const upload = multer({ storage });
app.listen(3000);
app.use(express.json());
app.use(methodOverride('_method'));
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs.engine({}));
app.set('views', './public/views');

app.get('/', async (req, res) => {
  try {
    let posts = await Post.find({}).lean();
    res.render('index', { layout: false, posts });
  } catch (e) {
    res.send('An error ocurred');
  }
});
app.get('/article/:id/', async (req, res) => {
  let _id = req.params['id'];
  let article = await Post.findById({ _id });
  const { title, post,author,metaDescription,} = article
  // let post = article.post;
  // let title = article.title;
  let img = `http://localhost:3000/file/${title}`;
  // res.send(article.post)
  res.render('article', { layout: false, title, post, img, author, metaDescription });
});
app.get('/login', (req, res) => {
  res.render('login', { layout: false });
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user == null) {
      res.status(403).send('Wrong Credentials, Try Again');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.render('dashboard', { layout: false });
    } else {
      res.status(403).send('Wrong Credentials, Try Again Buddy');
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/submit-article', upload.single('picture'), async (req, res) => {
  let post = new Post(req.body);
  console.log(post,10000,'article submitted')
  await post.save();
  res.json(post);
});

// app.get('/images/posts/:id', async (req,res)=>{
//         let post = await Post.findById({_id:req.params.id})
//         console.log(post.id)
//         res.set('Content-Type','image/png')
//         res.send(post.image)
//         // res.set('Content-Type','image/png')
// })

app.get('/file/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename + '.jpg' }, (err, file) => {
    //Check if files
    console.log(file);

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }

    if (1 === 1) {
      console.log(file.filename);
      const bucket = new mongoose.mongo.GridFSBucket(conn, {
        bucketName: 'uploads',
      });
      const readStream = bucket.openDownloadStreamByName(file.filename);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image',
      });
    }
  });
});

app.get('/category/:category', async (req,res)=>{
    const posts = await Post.find({category:req.params.category}).lean()
    res.render('category',{layout:false,category:req.params.category,posts:posts})
})

// async function createUser(){
//     let user = 'tonyv95';
//     let password = 'nfpsForLife2022';
//     let salt =  bcrypt.genSaltSync(10);
//     let hashedPassword = bcrypt.hashSync(password,salt)
//     let newUser = new User({username:'tonyv95', password:hashedPassword})
//     await newUser.save()
//     // let passwordMatches = await bcrypt.compare('onMyWayThere2022',hashedPassword);
//     // console.log(passwordMatches,'password matches')
// }

// createUser()
