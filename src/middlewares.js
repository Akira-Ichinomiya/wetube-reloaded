import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube8586/images",
  acl: "public-read",
});
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube8586/videos",
  acl: "public-read",
});

const multerUpload = multerS3({
  s3: s3,
  bucket: "wetube8586",
  acl: "public-read",
});

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
    console.log("protectorMiddleware 지나갑니다. 정상적인 로그인 접근입니다.");
    next();
  } else {
    req.flash("error", "Log in First.");
    return res.redirect("/login");
  }
};

//로그인한 유저가 로그인하지 않은 유저가 이동할 수 있는 사이트로 가려는 경우
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    console.log(
      "publicOnlyMiddleware 지나갑니다. 로그인을 하지 않은 유저만이 접근할 수 있습니다."
    );
    next();
  } else {
    req.flash("error", "Already logged in!");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
