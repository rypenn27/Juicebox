const express = require("express");
const postsRouter = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  getPostById,
} = require("../db/index.js");

const { requireUser } = require("./utils");

// in api/posts.js

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);
    console.log("posts", posts);
    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  res.send({ message: "under construction" });
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  console.log("body", req.body);

  const tagArr = tags.trim().split(/\s+/);
  let postData = {};

  // only send the tags if there are some to send
  console.log("tagarr", tagArr);
  if (tagArr.length) {
    postData.tags = tagArr;
  }
  console.log("postdata before", postData);
  try {
    // add authorId, title, content to postData object
    const authorId = 1;
    postData = { ...postData, authorId, title, content };
    console.log("postdata after", postData);

    // creates post and tags for us
    let post = await createPost(postData);

    // if post comes back, res.send({ post });
    if (post) {
      res.send({ post });
    }
    // otherwise, next an appropriate error object
    else {
      next({
        name: "NoPosts",
        message: "No posts available",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts,
  });
});

module.exports = postsRouter;
