const { sign } = require("jsonwebtoken");

const createAccessToken = userId => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    exports: "15m"
  });
};

const createRefreshToken = userId => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    exports: "7d"
  });
};

const sendAccessToken = (res, req, accessToken) => {
  res.send({
    accessToken,
    email: req.body.email
  });
};

const sendRefreshToken = (res, token) => {
  res.cookie("refreshtoken", token, {
    httpOnly: true,
    path: "/refresh_token"
  });
};

module.exports = {
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
  sendAccessToken
};
