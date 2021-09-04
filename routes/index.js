var express = require("express");
var router = express.Router();
var request = require("axios");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "GITHUB RESUME" });
});

router.get("/generate/:username", async (req, res) => {
  const username = req.params.username;
  //console.log(username)
  try {
    //User Details Function
    var github_user = async (username) => {
      var url = "https://api.github.com/users/" + username,
        response = await request.get(url);
      //console.log(response)
      return response;
    };

    res.render("resume");
  } catch (e) {
    console.log(e);
    res.render("error", { message: "An error occured" });
  }
});

module.exports = router;
