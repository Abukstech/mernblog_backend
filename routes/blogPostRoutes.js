const express = require("express");

const {
  getAllBlogs,
  createBlog,
  getASingleBlog,
  updateBlog,
  deleteBlog,
} = require("./../controller/blogPostController");

const { protect, restrictTo } = require("./../controller/authController");

const router = express.Router();

// router.param("id", checkId);

router.route(`/`).get(getAllBlogs).post(createBlog);

router
  .route("/:id")
  .get(getASingleBlog)
  .patch(updateBlog)
  .delete(protect, restrictTo("admin"), deleteBlog);

module.exports = router;
