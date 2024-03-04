import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/",(reqest, response) => {
    //response.send("Hello, World");
    response.status(201).send({msg: 'Hello!'});
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})