import { Application, Request, Response } from 'express';
import express from 'express';
import './utils';
import session from 'express-session';
import { Item, addItem, deleteItemById, getData, getItems, getItemsByUserId, patchHandler, users } from './utils';
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

    const catcat = await getData();
    res.send(catcat.items.find(v => v.id === catcat.next_item_id - 1)).status(201);
  }
});

app.patch("/items/:id", async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);
  else {
    const uid = req.session.user.id;
    const catreal = await getItemsByUserId(uid);
    if (!catreal.find(v => v.fk_user_id === uid && v.id === Number(req.params.id))) res.sendStatus(404);
    else {
      const patchId = parseInt(req.params.id);
      const dataToPatchWith = req.body;
      await patchHandler(patchId, dataToPatchWith);
      res.send((await getItems()).find(v => v.id === patchId)).status(200);
    }
  }
});

app.delete("/items/:id", async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);

  const itemToDelete = parseInt(req.params.id);
  await deleteItemById(itemToDelete);
});

app.delete("/list", async (req: Request, res: Response) => {
  //implement saving userId into session
});

app.listen(port, () => { console.log(`App is listening to: ${port}`); });