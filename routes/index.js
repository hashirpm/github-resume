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

    //Sort by Popularity
    function sortByPopularity(a, b) {
      return b.popularity - a.popularity;
    }

    //Sort Languages
    function sortLanguages(languages, limit) {
      var languageTotal = 0;
      var sorted_languages = [];

      for (var lang in languages) {
        if (typeof lang !== "string") {
          continue;
        }
        sorted_languages.push({
          name: lang,
          popularity: languages[lang],
        });

        languageTotal += languages[lang];
      }

      if (limit) {
        sorted_languages = sorted_languages.slice(0, limit);
      }

      return sorted_languages.sort(sortByPopularity);
    }
    var get_starred_resume = async (username, page) => {
      var star = false;
      var repos = [];
      var page = page ? page : 1;
      var url =
        "https://api.github.com/users/" +
        username +
        "/starred?per_page=100&page=" +
        page;

      str_repos = await request.get(url);
      console.log(str_repos.data);
      for (var i in str_repos.data) {
        repo = str_repos.data[i];

        if ((i = 0)) {
          console.log(repo);
        }
        if (repo.full_name == "hashirpm/github-resume") {
          console.log(repo);
          star = true;
          return star;
        }
      }

      if (repos.length == 100) {
        star = get_starred_resume(username, page + 1);
      }

      return star;
    };

    //------------CALL FUNCTIONS-------------


    var userdata = await get_user(username);
    const isStarred = await get_starred_resume(username); //Is Starred Calling
    console.log(isStarred); //Got isStarred
    if(!isStarred){
      res.render("nostar");
    }
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

    data = await get_user_repos(username, 1, []);

    var sorted_repos = [],
      languages = {},
      popularity;

    for (var i in data) {
      repo = data[i];

      if (repo.fork !== false) {
        continue;
      }

      if (repo.language) {
        if (repo.language in languages) {
          languages[repo.language]++;
        } else {
          languages[repo.language] = 1;
        }
      }

      popularity = repo.watchers + repo.forks;
      since = new Date(repo.created_at);
      since = since.getFullYear();
      sorted_repos.push({
        position: i,
        popularity: popularity,
        info: repo,
        since: since,
      });
    }

    sorted_repos.sort(sortByPopularity);
    //console.log(sorted_repos) //Got repos
    var maxLanguages = 9,
      languages = sortLanguages(languages, maxLanguages);
    //console.log(languages); //Got languages

    user_issues = await get_user_issues(username, 1, []);
    var sorted_issues = [],
      repos = {};

    for (var i in user_issues[0].items) {
      issue = user_issues[0].items[i];

      if (repos[issue.repository_url] === undefined) {
        repo_url = issue.html_url.split("/pull")[0];

        repo_name = repo_url.split("/")[4];

        repos[issue.repository_url] = {
          popularity: 1,
          repo_url: repo_url,
          repo_name: repo_name,
        };
      } else {
        repos[issue.repository_url].popularity += 1;
      }
    }

    for (var repo in repos) {
      obj = repos[repo];

      sorted_issues.push({
        repo: repo,
        popularity: obj.popularity,
        repo_url: obj.repo_url,
        repo_name: obj.repo_name,
      });
    }

    sorted_issues.sort(sortByPopularity);
    //console.log(sorted_issues)// Got issues

    user_orgs = await get_user_orgs(username);

    var sorted_orgs = [];
    for (var i in user_orgs.data) {
      org = user_orgs.data[i];
      if (org.login === undefined) {
        continue;
      }
      sorted_orgs.push({ position: i, info: org });
    }

    //console.log(sorted_orgs);//Got all orgs
lim_repos = sorted_repos.slice(0,6)
lim_issues = sorted_issues.slice(0,6)
lim_orgs = sorted_orgs.slice(0,6)

    //-------------RENDER-----------------
    res.render("resume", { user: user_data ,      repos: lim_repos,
      languages: languages,
      contributions: lim_issues,
      orgs: lim_orgs,});
  } catch (e) {
    console.log(e);
    res.render("error", { message: "An error occured" });
  }
});

module.exports = router;
