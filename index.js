const RedditClient = require("./redditapi/reddit");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => res.status(204).send("Hello World!"));

app.post("/", async (req, res) => {
  /*
    {
    contentObj: {
      contentText: 'dsfdsf',
      contentId: 't3_frtzfr'
    },
    selectValue: 'random'
  }
  */

  if (!req.body.contentObj || !req.body.selectValue) {
    return res.status("404").send({ status: "errror" });
  }

  try {
    await new RedditClient().comment(req.body);
    console.log(req.body); // your JSON
    return res.status(200).send(req.body);
  } catch (err) {
    return res.status("404").send({ status: "errror" });
  }
  // echo the result back
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
