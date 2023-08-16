// const blogPost = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/blog.json`));

const Blog = require("./../models/blogModel");

// exports.checkId = (req,res,next,val) => {
//     console.log(`blogPost id is ${val}`);
//     if (req.params.id * 1 > blogPost.length) {
//     return   res.status(404).json({
//         status: 'fail',
//         message: 'Blog not found',
//       });
//     }
//     next();
//   }

//   exports.checkContent = (req,res,next) => {
//     console.log(req.body);
//     if (!req.body.content || !req.body.title) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'name and price is required',
//       });
//     }

//     next();

//   }

exports.getAllBlogs = async (req, res) => {
  try {
    const blogPosts = await Blog.find();
    console.log(req.requestTime);
    res.status(200).json({
      status: "success",

      results: blogPosts.length,
      data: {
        blogPosts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "unable to get blog posts",
    });
  }
};

//   const newId = () => {
//     return blogPost[blogPost.length - 1].id + 1;
//   };

exports.createBlog = async (req, res) => {
  // console.log(req.body);
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        blogPost: newBlog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.getASingleBlog = async (req, res) => {
  try {
    const singleBlog = await Blog.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        singleBlog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Invalid Id",
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        blog: blog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
    });
  }
};
