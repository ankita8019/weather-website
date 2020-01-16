const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// console.log(__dirname);
// console.log(path.join(__dirname, "../public"));
// console.log(__filename);

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Ankita"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Flower",
    name: "Ankita"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "this is some help text message.",
    title: "Help",
    name: "Ankita"
  });
});

// app.get("", (request, response) => {
//   //   response.send("Hello Express!");
//   response.send("<h1>Hello Express!</h1>");
// });

// app.get("/help", (request, response) => {
//   //   response.send("Help Page");
//   response.send([
//     {
//       name: "ankita",
//       age: 26
//     },
//     {
//       name: "Shailesh",
//       age: 29
//     }
//   ]);
// });

// app.get("/about", (req, res) => {
//   //   res.send("About Page");
//   res.send("<h1>About Page</h1.");
// });

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404page", {
    title: "404",
    name: "Ankita",
    errorMessage: "Help Article Not Found"
  });
});

app.get("*", (req, res) => {
  res.render("404page", {
    title: "404",
    name: "Ankita",
    errorMessage: "Page Not Found"
  });
  // res.send("My 404 page");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
