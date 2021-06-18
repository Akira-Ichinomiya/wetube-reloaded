import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    console.log(videos);
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    res.render("Server-error");
  }
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch");
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit");
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload video!" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    const video = new Video({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload video!",
      errorMessage: error._message,
    });
  }
};
