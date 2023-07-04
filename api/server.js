import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router } from './routers/fileshareRouter.js';
import cors  from 'cors'; // Import cors
import path from 'path';

dotenv.config();

const Database = process.env.MODE === 'test' ? 'FileShareDB_Test' : 'FileShareDB';

const app = express();

// const corsOptions = {
//   origin: `http://localhost:${process.env.PORT}/`, // Replace with your allowed origin(s)
//   methods: 'GET, POST, PUT, DELETE',
//   // allowedHeaders: 'Content-Type, Authorization',

//   allowedHeaders: ['Content-Type'],
//   exposedHeaders: ['Authorization'],
//   credentials: true
  
// };


// app.use(cors(corsOptions)); // Use cors middleware

app.use(cors());

app.use(express.json());
app.use('/', router);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.listen(process.env.PORT, () => {
  console.log(`Server is running on: localhost:${process.env.PORT}`);

  mongoose
    .connect(`mongodb://127.0.0.1:${process.env.MONGODBPORT}/${Database}`)
    .then(() => {
      console.log(`MongoDB is running on: mongodb://localhost:${process.env.MONGODBPORT}`);
      console.log(`Database is ${Database}`);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
});

// npm run start

// npm run dev


