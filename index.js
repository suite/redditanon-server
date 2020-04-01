const RedditClient = require("./redditapi/reddit");
const { body, validationResult } = require("express-validator");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Hello World!"));

app.post(
  "/",
  [
    body("contentText")
      .not()
      .isEmpty(),
    body("contentId")
      .not()
      .isEmpty(),
    body("selectValue")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Must be random... In future add other options?
    if (req.body.selectValue != "random") {
      return res.status(422).json({ errors: ["Unknown select value"] });
    }

    try {
      let url = await new RedditClient().commentRandom(req.body);
      console.log("server got url", url);
      res.status(200).json({ url });
    } catch (err) {
      console.log("Error getting url", err.message);
      return res.status(422).json({ errors: [err.message] });
    }
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
