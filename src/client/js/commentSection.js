const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const addComment = (text) => {
  const videoComments = document.getElementById("comments");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  console.log("icon", icon);
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  console.log("span", span);
  span.innerText = `${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  console.log("newComment", newComment);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (status === 201) {
    addComment(text);
  }
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
