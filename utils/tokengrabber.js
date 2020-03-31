const rp = require("request-promise");
//altinator5000:SDFkl324
(async () => {
  let username = "altinator5000";
  let password = "SDFkl324";
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
    json: { username, password, otp: "" }
  };

  try {
    const body = await rp(opts);

    console.log(body);
  } catch (err) {
    console.log(err.message);
  }
})();
