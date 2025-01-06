import express, { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";
import User from "./src/v1/models/user";
import env from "dotenv";
env.config();

const app = express();
const port = 8080;

app.use(express.json());

if (!process.env.MONGODB_URL || !process.env.SECRET_KEY) {
  throw new Error("必要な環境変数が設定されていません");
}

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("dbと接続中");
} catch (err) {
  console.log(err);
}

const registerHandler: RequestHandler = async (req: Request, res: Response) => {
  //パスワードの受け取り
  const password: string = req.body.password;

  try {
    //パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY as string
    );
    //ユーザーの新規作成
    const user = await User.create(req.body);
    //jwt
    const token = JWT.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

app.post("/register", registerHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});