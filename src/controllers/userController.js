import User from "../models/User";

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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove user");
export const login = (req, res) => res.send("Log in");
export const logout = (req, res) => res.send("logout");
export const account = (req, res) => res.send("id");
