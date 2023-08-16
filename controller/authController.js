const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }

  next();
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //If email and password exist
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter a valid email or password",
      });

      next();
    }

    // check if user exists and password id valid

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Inavlid email or password",
      });
    }
    //if everythin is okay ,send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: "OK",
      token,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  //1) Getting the token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);

  if (!token) {
    return next(res.status(401).json("Invalid Token"));
  }
  //2) Verify the token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.user = decoded;
    // console.log(decoded)
  } catch (err) {
    return res.status(401).json("Invalid Token");
  }

  //

  //3) Check if user exists

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(res.status(401).json("The user does not exist"));
  }

  //4) Check if user change password after the JWT was issued

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(res.status(401).json("user changed password"));
  }

  req.user = freshUser;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res
          .status(403)
          .json("You do not have permission to perform this action")
      );
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) get user based on posted email address
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(
      res.status(404).json("There is no user with this email address")
    );
  }
  // 2)generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save();
  //2)send it to the user email
};
exports.resetPassword = (req, res, next) => {};
