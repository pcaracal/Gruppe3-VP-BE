import { Application, Request, Response } from 'express';
import express from 'express';
import './utils';
import { addItem, deleteItemById, getData, patchHandler } from './utils';
const app: Application = express();
const port = 3000;
app.use(express.json());

app.get("/items", (request, response) => {
    getData();
});

app.post("/items", (request, response) => {
    const dataToPost = request.body;
    addItem(dataToPost);
    response.status(201).send("Successfully added the item");
});

app.patch("/items/:id", (request, response) => {
    const itemToPatch = parseInt(request.params.id);
    const dataToPatchWith = request.body;
    patchHandler(itemToPatch, dataToPatchWith);
});

app.delete("/items/:id", (request, response) => {
    const itemToDelete = parseInt(request.params.id);
    deleteItemById(itemToDelete);
});

app.delete("/list", (request, response) => {
    //implement saving userId into session
});

app.listen(port, () => { console.log(`App is listening to: ${port}`); });