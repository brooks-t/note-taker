const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");


const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

//require("./routes/apiRoutes")(app);
//require("./routes/htmlRoutes")(app);

const readFile = async () => {
    let data = await readFilePromise("./db/db.json", "utf8")
    return JSON.parse(data)
}

const writeFile = async (data) => {
    data = JSON.stringify(data, null, 2)
    await writeFilePromise("./db/db.json", data)
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', async (req, res) => {
    let data = await readFile()
    res.json(data)
});

app.get('/api/notes/:id', async (req, res) => {
    const note = req.params.id;
    let data = await readFile()
    let [matchedId] = data.filter(id => id.title === note )
    if (matchedId) return res.json(matchedId);
    return res.json(false);
});

app.post('/api/notes', async (req, res) => {
    const newNote = req.body;
    let data = await readFile()
    await writeFile([...data, newNote])
    res.json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
    const note = req.params.id;
    let data = await readFile()
    let [matchedId] = data.filter(id => id.title === note)
    if (matchedId) return res.json(matchedId);
    return res.json(false);
});



app.listen(PORT, () => console.log(`Note Taker App listening on PORT http://localhost:${PORT}`));