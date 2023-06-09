const express = require("express");
const passport = require("passport");
const {
  signup,
  signin,
  forgotPassword,
  getProfile,
} = require("../controller/authController");
const AuthMiddleware = require("../helper/AuthMiddleware");
const router = express.Router();

const api = process.env.API;
const redirectURL = process.env.REDIRECT_URL
const backendURL=process.env.BACKEND_URL

// ========================================Middleware for google login===============================================================
const isLoggedIn=(req, res, next)=> {
  req.user ? next() : res.redirect(redirectURL);
}
// ========================================Google Login===============================================================
router.get(
 `${api}/google`,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  `/auth/google/callback`,
  passport.authenticate("google", {
    successRedirect: "/login/success",
    failureRedirect: "/login/failed", 
  })
);

// router.get("/logout", (req, res) => {
//   req.logout();
// });


router.get("/login/success",isLoggedIn, (req, res) => {
  if (req.user) {
    res.redirect(`${redirectURL}?token=${req.user}`);
  } else {
    res.redirect(redirectURL);
  }
});

router.get('/login/failed',(req,res)=>res.status(401).json({success:false,message:"Something went to wrong.please try agian."}))


// ==========================================Manual Login with Email=============================================================
router.post(`${api}/signup`, signup);

router.post(`${api}/signin`, signin);

router.put(`${api}/forgot-password`, forgotPassword);

router.get(`${api}/profile/get`,AuthMiddleware, getProfile)

module.exports = router;
