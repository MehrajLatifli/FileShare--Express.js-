import express from 'express';
import { authChecker } from '../auth/middleware.js';
import { comparePassword, createHashPassword, createToken } from '../auth/authorization.js';
import { User, File } from '../models/fileshare.js';
import multer from 'multer';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
export const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { password, username, email } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      const newUser = await User.create({ password, username, email });
      const hashed = createHashPassword(password);
      newUser.password = hashed;
      await newUser.save();
      return res.status(201).json(newUser);
    }
    return res.status(400).send('User exists');
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { password, username } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(400).send('User does not exist');
    }
    if (!comparePassword(password, user.password)) {
      return res.status(400).send('Password does not match');
    }


    const token = createToken({ username: user.username, id: user._id, email: user.email });
    return res.status(200).json({ Bearer: token });

  } catch (error) {
    return res.json(error.message);
  }
});

router.post('/logout', authChecker, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    user.tokens = [];
    await user.save();

    return res.status(200).send('Logged out successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


router.get('/user', authChecker, async (req, res) => {


  const user = await User.findById(req.user.id)
  return res.status(200).json(user);
});

const maxFileSize = 10 * 1024 * 1024;
const uploader = multer({ dest: './temp', });






router.post('/file', authChecker, uploader.array('upload', 5), async function (req, res, next) {
  try {
    
    const uploadDir = './uploads';
    const tempDir = './temp';
    
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const files = req.files;
    const fileUrls = [];


    if (!fs.existsSync(`./uploads/${req.user.username}`)) {
      fs.mkdirSync(`./uploads/${req.user.username}`);
    }

    const guidiD = uuidv4();

    for (const file of files) {

      const tempPath = file.path;
      const originalFileName = file.originalname;
      const username = req.user.username; 
      const fileName = `${username}_${guidiD}.${path.extname(originalFileName).substr(1)}`; 
      const uploadPath = path.join(`./uploads/${req.user.username}`, fileName);
      
      if (file.size <= 10000000) {
        

        if (path.extname(file.originalname).substr(1) === 'jpeg' ||
          path.extname(file.originalname).substr(1) === 'jpg' ||
          path.extname(file.originalname).substr(1) === 'png' ||
          path.extname(file.originalname).substr(1) === 'gif' ||
          path.extname(file.originalname).substr(1) === 'png' ||
          path.extname(file.originalname).substr(1) === 'gif' ||
          path.extname(file.originalname).substr(1) === 'pdf' ||
          path.extname(file.originalname).substr(1) === 'mp3' ||
          path.extname(file.originalname).substr(1) === 'mp4' ||
          path.extname(file.originalname).substr(1) === 'zip') {


      
          fs.renameSync(tempPath, uploadPath);

    
          const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.user.username}/${fileName}`;
          fileUrls.push(fileUrl);


      
        }

      }
      const fileData = {
        user_id: req.user.id,
        filename: fileName,
        filesize: file.size,
        filetype: path.extname(originalFileName).substr(1),
        filepath:fileUrls,
        users: [req.user.id]
      };

      
      const createdFile = await File.create(fileData);
      console.log('Created File:', createdFile);

      
     

    }

    return res.status(200).json({ fileUrls });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



router.get('/file', authChecker, async function (req, res, next) {
  try {
    const userId = req.user.id;

    const files = await File.find({
      $or: [
        { user_id: userId },
        { users: userId }
      ]
    }).populate({
      path: 'user_id',
      select: 'username'
    }).populate('users', 'username');

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found for the user' });
    }

    const fileData = files.map(file => {
      const users = file.users.map(user => user.username);
      const filteredUsers = users.filter(username => username !== file.user_id.username);

      return {
        id: file._id,
        userId:userId,
        filename: file.filename,
        filesize: file.filesize,
        filetype: file.filetype,
        filepath: file.filepath,
        username: file.user_id.username,
        users: filteredUsers
      };
    });


    
    return res.status(200).json(fileData);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});









router.delete('/file/:id', authChecker, async function (req, res, next) {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;


    const file = await File.findOne({ _id: fileId, user_id: userId });
    if (!file) {
      return res.status(404).json({ message: 'You do not have permission' });
    }


    const filePath = path.join('./uploads', req.user.username, file.filename);
    fs.unlinkSync(filePath);


    await File.findByIdAndDelete(fileId);

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.get('/users', authChecker, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



router.put('/share/:fileId/:userId', authChecker, async function (req, res, next) {
  try {
    const  userId = req.params.userId;
    const  fileId = req.params.fileId;
    const { filename, filesize, filetype, filepath } = req.body;


 
    
    const file = await File.findOne({ _id: fileId, user_id: req.user.id});
    if (!file) {
      return res.status(404).json({ message: 'You do not have permission' });
    }

file._id=fileId;
file.user_id=req.user.id;
    file.filename = filename;
    file.filesize = filesize;
    file.filetype = filetype;
    file.filepath = filepath;


    if (!file.users.includes(userId)) {
      file.users.push(userId);
    }

 
    await file.save();

    return res.status(200).json({ message: 'File updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.delete('/share/:fileId/:userId', authChecker, async function (req, res, next) {
  try {
    const fileId = req.params.fileId;
    const userId = req.params.userId;

    
    const file = await File.findOne({ _id: fileId, user_id: req.user.id});
    if (!file) {
      return res.status(404).json({ message: 'You do not have permission' });
    }

  
  

    file.users = file.users.filter((id) => id.toString() !== userId);

    await file.save();

    return res.status(200).json({ message: 'UserId removed from the file successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});








