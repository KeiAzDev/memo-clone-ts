import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import env from 'dotenv';
env.config();

const app = express();
const port = 8080;

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URLが設定されていません');
}

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log('dbと接続中')
} catch(err) {
  console.log(err);
}

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript with Express!');
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
