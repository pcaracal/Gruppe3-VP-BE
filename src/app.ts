import { Application, Request, Response } from 'express';
import express from 'express';
import './utils';
import session from 'express-session';
import { Item, addItem, deleteItemById, getData, getItemsByUserId, patchHandler, users } from './utils';
const app: Application = express();
const port = 3000;
app.use(express.json());

import cors from 'cors';
app.use(cors({
  origin: '*'
}));

app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/login', async (req: Request, res: Response) => {
  req.session.user = undefined; //Delete old session before login

  const foundUser = users.find((u) => u.code === req.body.code);
  if (!foundUser) res.sendStatus(401);
  else {
    req.session.user = foundUser;
    res.send({ id: foundUser.id, code: foundUser.code }).status(200);
  }
});

app.delete('/logout', async (req: Request, res: Response) => {
  req.session.user = undefined;
  res.sendStatus(204);
});

app.get('/session', async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);
  else res.send({ id: req.session.user.id, code: req.session.user.code }).status(200);
});



app.get("/items", async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);
  else {
    try {
      res.send(await getItemsByUserId(req.session.user.id)).status(200);
    } catch (error) {
      res.send(error).status(500);
    }
  }
});

app.post("/items", async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);
  else {
    let dataToPost: Item = req.body;
    dataToPost.fk_user_id = req.session.user.id;
    await addItem(dataToPost);
    res.send("Successfully added the item").status(201);
  }
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