const express = require("express");
const server = express();
server.set("view engine", "ejs");
const PORT = 3000;

const general = require("./helpers/general");

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
let users = general.getUsers();
let pages = [];
for (let index = 0; index < 100; index++) {
  pages[index] = index;
}
server.get("/users", (req, res) => {
  return res.json(users);
});
server.post("/add-user", (req, res) => {
  const user = req.body;
  users.push(user);
  return res.json("user added");
});
server.put(["/update-user", "/update-user/:id"], (req, res) => {
  const ID = req.params.id;
  let person = req.body;
  users.find((user) => {
    if (user.id == ID) {
      user.fname = person.fname;
      user.lname = person.lname;
    }
  });
  return res.json("user updated");
});
server.delete(["/delete-user", "/delete-user/:id"], (req, res) => {
  const ID = req.params.id;

  users.find((user) => {
    if (user.id == ID) {
      users.pop(user);
    }
  });
  return res.status(200).json("user deleted");
});

server.post(["/number", "/number/:id"], (req, res) => {
  const number = req.params.id;
  if (number != 0) {
    return res.json(100 / number);
  } else {
    return res.status(400).send();
  }
});

server.post(["/check-user"], auth, (req, res) => {
  return res.json("user exists");
});

server.get("/page", (req, res) => {
  let page = req.body;
  const x = page.pageSize * (page.pageNumber - 1);
  const y = parseInt(page.pageSize);
  let result = [];

  for (let index = x; index < x + y; index++) {
    result[index - x] = pages[index];
  }
  let items = {
    items: result,
    total: pages.length,
  };
  return res.json(items);
});
function auth(req, res, next) {
  const person = {
    fname: req.headers["fname"],
    lname: req.headers["lname"],
  };
  const exist = users.find(
    (user) => user.fname == person.fname && user.lname == person.lname
  );
  if (exist) {
    next();
  } else {
    return res.status(401).json("access denied");
  }
}

server.listen(3000, () => {
  console.log(`\n*** Server Running on htttp://localhost:${PORT}`);
});
