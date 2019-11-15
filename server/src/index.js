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
const { isAuth } = require("./isAuth");

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

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

server.post("/logout", (_req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });

  return res.send({ message: "Logged Out" });
});

server.post("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      res.send({ data: "This is protected data" });
    }
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

server.post("/refresh_token", (req, res) => {
  const token = req.cookies.refreshtoken;
  if (!token) throw res.send({ accesstoken: "" });

  // verify the token
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }
  // the token is valid, then check if user is exist
  const user = fakeDB.find(user => user.id === payload.userId);
  if (!user) return res.send({ accesstoken: "" });

  // user exist, check if refreshtoken exist on user
  if (user.refreshtoken !== token) return res.send({ accesstoken: "" });

  // token exist, create new Refresh- and Accesstoken
  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);
  user.refreshtoken = refreshtoken;
  // All goood to go, send new refreshtoken and accesstoken
  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
});

server.listen(process.env.PORT, () =>
  console.log(`server listening on http://localhost:${process.env.PORT}`)
);
