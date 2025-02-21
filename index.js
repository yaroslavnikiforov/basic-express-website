const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function(req, res) {
  res.render("index", { title: "Computer not working?" });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.post("/contact/send", function(req, res) {
  nodemailer.createTestAccount().then(testAccount => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const mailOptions = {
      from: `Majin Buu <${testAccount.user}>`,
      to: "mbuu8888@gmail.com",
      subject: "Website submition",
      text: `You have a submition with the following details... Name: ${req.body.name} Email: ${req.body.email} Message: ${req.body.message}`,
      html: `<p>You have a submition with the following details...</p><ul><li>Name: ${req.body.name}</li><li>Email: ${req.body.email}</li><li>Message: ${req.body.message}</li></ul>`
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.error(err);

        res.redirect("/");
      } else {
        console.info("Message sent: ", info.response);

        res.redirect("/");
      }
    });
  });
});

app.listen(3000);

console.log("Server is running on port 3000...");
