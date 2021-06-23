import User from "../models/User";
import bcrypt from "bcrypt";

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
  const user = await User.findOne({ username });
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
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove user");
export const logout = (req, res) => res.send("logout");
export const account = (req, res) => res.send("id");
