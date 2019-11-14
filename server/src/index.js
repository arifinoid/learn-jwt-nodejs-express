require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const { fakeDB } = require("./fakeDB");
const {
  createRefreshToken,
  createAccessToken,
  sendAccessToken,
  sendRefreshToken
} = require("./tokens");

const server = express();

server.use(cookieParser());
server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error("User already exist");

    const hashedPassword = await hash(password, 10);
    fakeDB.push({ id: fakeDB.length, email, password: hashedPassword });
    res.send({ message: "User created successfully" });

    console.log(fakeDB);
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error("User doesn't exist");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password not correct, please check it again");

    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    user.refreshtoken = refreshtoken;
    console.log(fakeDB);

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

server.listen(process.env.PORT, () =>
  console.log(`server listening on http://localhost:${process.env.PORT}`)
);
