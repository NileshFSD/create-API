import express, { application } from "express";
import { readFileSync } from "fs";
const app = express();
import products from "./Products.js";

// create server using express framework-------------------------
// import express
// define app
// create-server by using get method

// app.use =>use() method mounts or puts the specified middleware functions
// at the specified path. This middleware function will be executed only
// when the base of the requested path matches the defined path.

/*
app.get("/", (req, res) => {
  res.status(200).send("<h2>Home page</h2>");
});

app.get("/about", (req, res) => {
  res.status(200).send("<h2>This is an about page</h2>");
});
app.all("*", (req, res) => {
  res
    .status(404)
    .send(`<h2>Page not found</h2> \n<a href="/">Go back to home</a>`);
});

app.listen(5000, () => {
  console.log("Server is running in: http://localhost:5000");
});

*/

//Api------------------------------------------------

const baseUrl = "/api";

const loginMiddleware = (req, res, next) => {
  const { username } = req.query;
  if (username === "admin") {
    req.username == "admin";
    next();
  } else {
    res.status(401).send("<h1>Unauthorized user</h1>");
  }
};

const middleware = (req, res, next) => {
  next();
};

app.get("/", middleware, (req, res) => {
  res
    .status(200)
    .send(`<h1>Home page </h1> \n<a href="/login">Please login</a>`);
});

app.get("/login", loginMiddleware, (req, res) => {
  const { username } = req.query;
  res
    .status(200)
    .send(
      `<h2>Username: ${username}</h2>  \n<a href=${
        baseUrl + "/products"
      }>see products</a>`
    );
});

app.get(baseUrl + "/products", (req, res) => {
  const newProducts = products.map((product) => {
    const { id, title, description, price } = product;
    return { id, title, description, price };
  });
  res.status(200).json(newProducts);
});

app.get(baseUrl + "/products/:productId", (req, res) => {
  const { productId } = req.params;
  if (productId > 20) {
    res.status(404).send("<h1>Product not available</h1>");
  }
  const singleProduct = products.find((product) => {
    return product.id === Number(productId);
  });
  res.status(200).send(singleProduct);
});

// http://localhost:5000/api/query?limit=num&search=value
app.get(baseUrl + "/query", (req, res) => {
  const { limit, search } = req.query;
  let sortedProd = [...products];
  if (search) {
    sortedProd = sortedProd.filter((product) => {
      return product.title.includes(search);
    });
  }
  if (limit) {
    sortedProd = sortedProd.slice(0, Number(limit));
  }

  if (sortedProd.length < 1) {
    return res.status(200).send("<h2>Item not found</h2>");
  }

  res.status(200).json(sortedProd);
});

app.all("*", (req, res) => {
  res.status(404).send(`<h2>Page not found</h2>
  <a href="/">go back to home page</a>
`);
});

app.listen(5000, () => {
  console.log("Server is running in: http://localhost:5000");
});
