import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const seeProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("home", { pageTitle: "Home" });
  }

  return res.render("users/profile", {
    pageTitle: `${user.name}'s Profile`,
    user,
  });
};
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, username, password, passwordConfirm, name, location } =
    req.body;
  const dupExists = await User.exists({ $or: [{ username }, { email }] });
  if (dupExists) {
    console.log("Same username found!:", dupExists);
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Email or username is already in use.",
    });
  }
  if (password !== passwordConfirm) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password Confirmation does not match.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
      avatarUrl: "",
    });
    return res.redirect("/login");
  } catch (error) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: error.message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log in!" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  console.log(username, password);
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    //존재하지 않는 경우
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exist.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log("깃허브 로그인에 관한 주소");
  console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      // fetch를 통하여 access_token을 달라고 요청함
      mehtod: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json(); //받아온 토큰데이터를 json으로 변환

  // res.send(JSON.stringify(json)); // 문자열화하여 프론트엔드에 출력
  if ("access_token" in tokenRequest) {
    // api에 접근(깃허브에서 필요한 개인정보 가져오기)
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //계정 생성시키기
      user = await User.create({
        name: userData.name === null ? "Unknown" : userData.name,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    // 로컬 세션 정보
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req; // req에서 정보수정을 요청한 유저의 데이터를 가져오기
  console.log(file);
  if (await User.exists({ $or: [{ username }, { email }] })) {
    return res.render("edit-profile", { dupExists: true }); //이메일이나 유저네임 중복 유무 확인
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === false) {
    return res.render("users/change-password", {
      pageTitle: "Change Password",
    });
  }
  return res.redirect("/");
};

export const postChangePassword = async (req, res) => {
  // 브라우저에 비번 바꿨다고 알림보내기
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, new1, new2 },
  } = req;

  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    //기존 비밀번호 비교
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "기존 비밀번호가 일치하지 않습니다.",
    });
  }

  if (new1 !== new2) {
    //새 비밀번호 비교
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "새로운 비밀번호가 일치하지 않습니다.",
    });
  }

  const user = await User.findById(_id);
  user.password = new1;
  console.log("세이브 이전:", user.password);
  await user.save();
  console.log("세이브 이후:", user.password);
  req.session.destroy();
  return res.redirect("/");
};
