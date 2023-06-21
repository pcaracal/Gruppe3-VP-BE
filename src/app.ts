import { Application, Request, Response } from 'express';
import express from 'express';
const app: Application = express();
const port = 3000;
app.use(express.json());

app.get("/items", (request, response) => {
    response.sendFile("/data.json");
});

app.get("/items/:id", (request, response) => {
    const itemToGet = request.params.id;
});

app.post("/items", (request, response) => {
    //Wert entgegennehmen und ins JSON-file ablegen
});

app.patch("/items/:id", (request, response) => {
    const itemToPatch = request.params.id;
    //Item mit der angegeben ID patchen
});

app.delete("/items/:id", (request, response) => {
    const itemToDelete = request.params.id;
    //Item mit der angegebenen ID löschen
});

app.delete("/list", (request, response) => {
    //Eine ganze Liste Löschen
});

app.listen(port, () => { console.log(`App is listening to: ${port}`); });