import express from 'express';
import cors from 'cors';
import body_parser from 'body-parser';
import router from './src/router.mjs';
const app = express();
const port = 3000;

app.use(cors());
app.use(router);

// Setting up view engine
app.set("view engine", "ejs");
app.use(express.static('public'));

// Body-Parser
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

