const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFilePromise = util.promisify(fs.readfile);
const writeFilePromise = util.promisify(fs.writefile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

const readFile = async () => {
    readFilePromise("./db/db.json", "utf8")
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

const writeFile = (data) => {
    data = JSON.stringify(data, null, 2)
    writeFilePromise("./db/.db.json", data)
    .then(data => console.log(data))
    .catch(err => console.log(err))
}


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));




app.listen(PORT, () => console.log(`Note Taker App listening on PORT http://localhost:${PORT}`));