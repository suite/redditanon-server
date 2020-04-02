const rp = require("request-promise");
const fs = require("fs");
const path = require("path");

module.exports = class RedditClient {
  constructor() {
    this.accounts = fs
      .readFileSync(path.join(__dirname, "../utils/accounts.txt"), "utf8")
      .split("\r\n");

    this.proxies = fs
      .readFileSync(path.join(__dirname, "../utils/proxies.txt"), "utf8")
      .split("\r\n");
  }

  async login(account) {
    let username = account.split(":")[0];
    let password = account.split(":")[1];

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
        username,
        password,
        otp: ""
      }
    };

    try {
      const body = await rp(opts);
      return body["session"]["accessToken"];
    } catch (err) {
      throw Error(`Error logging into ${username} ${err.message}`);
    }
  }

  async commentRandom(data) {
    let { contentText, contentId, selectValue } = data;

    const randAccount = this.accounts[
      Math.floor(Math.random() * this.accounts.length)
    ];

    const randProxy = this.proxies[
      Math.floor(Math.random() * this.proxies.length)
    ];

    console.log(`Using ${randAccount}...`);

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
      proxy: randProxy,
      resolveWithFullResponse: true
    };

    try {
      let resp = await rp(opts);
      resp = JSON.parse(resp.body);

      //Retry if rate limited... Needs more proxies
      if (resp["json"]["errors"].length > 0) {
        throw Error("Rate limited");
      }

      return resp["json"]["data"]["things"][0]["data"]["permalink"];
    } catch (err) {
      throw Error(err);
    }
  }
};
