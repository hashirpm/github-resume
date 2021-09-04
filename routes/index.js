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
    //-------------FUNCTIONS----------------
    //User Details Function
    var get_user = async (username) => {
      var url = "https://api.github.com/users/" + username,
        response = await request.get(url);
      //console.log(response)
      return response;
    };

    //User Repos Function
    var get_user_repos = async (username, page_number, prev_data) => {
      var page = page_number ? page_number : 1;

      var url =
        "https://api.github.com/users/" + username + "/repos?per_page=100";
      var data = prev_data ? prev_data : [];
      if (page_number > 1) {
        url += "&page=" + page_number;
      }

      response = await request.get(url);

      data = data.concat(response.data);

      if (response.length == 100) {
        get_user_repos(username, page + 1, data);
      } else {
        return data;
      }
    };

    //User Issues Functions
    var get_user_issues = async (username, page_number, prev_data) => {
      var page = page_number ? page_number : 1,
        url =
          "https://api.github.com/search/issues?q=type:pr+is:merged+author:" +
          username +
          "&per_page=100";
      data = prev_data ? prev_data : [];

      if (page_number > 1) {
        url += "&page=" + page_number;
      }
      response = await request.get(url);

      data = data.concat(response.data);
      if (response.total_count == 100) {
        get_user_issues(username, callback, page + 1, data);
      } else {
        return data;
      }
    };

    //user Orgs Function
    var get_user_orgs = async (username) => {
      var url = "https://api.github.com/users/" + username + "/orgs";
      response = await request.get(url);

      return response;
    };

    //------------CALL FUNCTIONS-------------
    var userdata = await get_user(username);

    data = userdata.data;

    var sinceDate = new Date(data.created_at);

    var since = sinceDate.getFullYear();

    var addHttp = "";
    if (data.blog && data.blog.indexOf("http") < 0) {
      addHttp = "http://";
    }

    var name = username;
    if (data.name !== null && data.name !== undefined && data.name.length) {
      name = data.name;
    }

    var user_data = {
      name: name,
      email: data.email,
      bio: data.bio,
      created_at: data.created_at,
      location: data.location,
      avatar_url: data.avatar_url,
      repos: data.public_repos,
      reposLabel: data.public_repos > 1 ? "repositories" : "repository",
      followers: data.followers,
      followersLabel: data.followers > 1 ? "followers" : "follower",
      username: username,
      since: since,
    };
    if (data.blog !== undefined && data.blog !== null && data.blog !== "") {
      user_data.website = addHttp + data.blog;
    }

    //console.log(user_data);//Got user data

    //-------------RENDER-----------------
    res.render("resume", { user: user_data });
  } catch (e) {
    console.log(e);
    res.render("error", { message: "An error occured" });
  }
});

module.exports = router;
