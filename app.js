const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = 3000;
const session = require("express-session");

app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(function (req, res, next) {
  if (req.session.isAuth) {
    console.log("Session found");
  } else {
    console.log("Session not found");
    //do auth
    //and then
    //if auth
    req.session.isAuth = true;
  }
  next();
});

app.use(
  "/getAllServices",
  createProxyMiddleware({
    target: "http://localhost:8080/api/v1/user/getAllServices",
    changeOrigin: true,
    pathRewrite: {
      "^/getAllServices": "/",
    },
  })
);

app.use(
  "/activateService",
  createProxyMiddleware({
    target: "http://localhost:8080/api/v1/user/activateService",
    changeOrigin: true,
    pathRewrite: {
      "^/activateService": "/",
    },
  })
);

app.use(
  "/deactivateService",
  createProxyMiddleware({
    target: "http://localhost:8080/api/v1/user/deactivateService",
    changeOrigin: true,
    pathRewrite: {
      "^/deactivateService": "/",
    },
  })
);

// User Authentication
app.use(
  "/login",
  createProxyMiddleware({
    target: "https://localhost:7122/api/Auth",
    changeOrigin: true,
    pathRewrite: {
      "^/login": "/",
    },
  })
);

// User Management
app.use(
  "/user",
  createProxyMiddleware({
    target: "https://localhost:7122/api/User",
    changeOrigin: true,
    pathRewrite: {
      "^/user": "/",
    },
  })
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
