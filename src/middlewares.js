import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  console.log("midddlewares.js를 거친 데이터입니다.");
  console.log(res.locals);
  next();
};

// 로그인하지 않은 유저가 비정상적으로 접근하려는 경우
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    console.log("protector 지나여");
    next();
  } else {
    return res.redirect("/login");
  }
};

//로그인한 유저가 로그인하지 않은 유저가 이동할 수 있는 사이트로 가려는 경우
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const uploadFiles = (req, res) => multer({ dest: "uploads/" });
