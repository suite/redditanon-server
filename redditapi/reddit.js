const rp = require("request-promise");

module.exports = class RedditClient {
  constructor() {
    this.accounts = [
      { username: "altinator5000", password: "SDFkl324" },
      { username: "notanalt500", password: "FDdf77333" }
    ];
  }

  async login(account) {
    const opts = {
      url: "https://www.reddit.com/loginproxy",
      method: "POST",
      headers: {
        origin: "https://www.reddit.com",
        referer: "https://www.reddit.com/login",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Mobile Safari/537.36"
      },
      json: {
        username: account["username"],
        password: account["password"],
        otp: ""
      }
    };

    try {
      const body = await rp(opts);
      return body["session"]["accessToken"];
    } catch (err) {
      throw Error(`Error logging into ${account["username"]} ${err.message}`);
    }
  }

  async commentRandom(data) {
    let { contentText, contentId, selectValue } = data;

    const randAccount = this.accounts[
      Math.floor(Math.random() * this.accounts.length)
    ];

    console.log(`Using ${randAccount["username"]}...`);

    let accessToken = await this.login(randAccount);

    console.log("Collected accessToken", accessToken);

    const opts = {
      url:
        "https://oauth.reddit.com/api/comment?redditWebClient=mweb2x&layout=classic&allow_over18=&app=2x-client-production&obey_over18=true&raw_json=1",
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "user-agent":
          "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Mobile Safari/537.36"
      },
      formData: {
        api_type: "json",
        thing_id: contentId,
        text: contentText,
        raw_json: "1"
      },
      resolveWithFullResponse: true
    };

    try {
      let resp = await rp(opts);
      resp = JSON.parse(resp.body);

      console.log(JSON.stringify(resp["json"]["errors"]));
      if (resp["json"]["errors"].length > 0) {
        throw Error("Rate limited");
      }

      console.log(
        "reply resp",
        resp["json"]["data"]["things"][0]["data"]["permalink"]
      );

      return resp["json"]["data"]["things"][0]["data"]["permalink"];
    } catch (err) {
      throw Error(err);
    }
  }
};
