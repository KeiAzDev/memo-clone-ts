import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
import User from './src/v1/models/user';
import env from 'dotenv';
env.config();

const app = express();
const port = 8080;

if (!process.env.MONGODB_URL || !process.env.SECRET_KEY) {
  throw new Error('必要な環境変数が設定されていません');
}

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log('dbと接続中')
} catch(err) {
  console.log(err);
}

app.post('/register', async (req: Request, res: Response) => {
  const password: string = req.body.password;

  try {
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY as string);
    const user = await User.create(req.body);
  } catch(err) {

  }
});

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript with Express!');
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
