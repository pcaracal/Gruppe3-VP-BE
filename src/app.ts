import { Application, Request, Response } from 'express';
import express from 'express';
import './utils';
import session from 'express-session';
import { Item, addItem, createUser, deleteAllItemsByUserId, deleteItemById, getData, getItems, getItemsByUserId, getUsers, patchHandler } from './utils';
const app: Application = express();
const cookieParser = require('cookie-parser');
const port = 3000;
app.use(express.json());
app.use(cookieParser());
import cors from 'cors';

app.use(cors({
  origin: ["http://127.0.0.1:5173", "http://127.0.0.1/session", "http://127.0.0.1/login", "http://127.0.0.1/items", "http://127.0.0.1/logout", "http://127.0.0.1/list"],
  credentials: true,
}));


app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// login endpoints

app.post('/signup', async (req: Request, res: Response) => {
  req.session.user = undefined;

  if (!req.body.code) {
    res.sendStatus(400);
  } else {
    const catUsers = await getUsers();

    const foundUser = catUsers.find((u) => u.code === req.body.code);
    if (!foundUser) {
      try {
        await createUser(req.body.code);
        console.log("CAAAAAAAAAAT");
        const sandcatUsers = await getUsers();
        const sandcatUser = sandcatUsers.find((u) => u.code === req.body.code)

        req.session.user = sandcatUser;
        res.cookie('connect.sid', req.sessionID);
        res.send({ id: sandcatUser?.id, code: sandcatUser?.code, cookie: req.sessionID }).status(200);
      } catch (error) {
        res.send(error).status(500);
      }
    }
    else {
      req.session.user = foundUser;
      res.cookie('connect.sid', req.sessionID);
      res.send({ id: foundUser.id, code: foundUser.code, cookie: req.sessionID }).status(200);
    }
  }
});

app.post('/login', async (req: Request, res: Response) => {
  req.session.user = undefined; //Delete old session before login

  const catUsers = await getUsers();

  const foundUser = catUsers.find((u) => u.code === req.body.code);
  if (!foundUser) res.sendStatus(401);
  else {
    req.session.user = foundUser;
    res.cookie('connect.sid', req.sessionID);
    res.send({ id: foundUser.id, code: foundUser.code, cookie: req.sessionID }).status(200);
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

// items endpoints

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
  const deleteId = parseInt(req.params.id);

  if (!req.session.user) res.sendStatus(401);
  else {
    const uid = req.session.user.id;
    const catreal = await getItemsByUserId(uid);
    if (!catreal.find(v => v.fk_user_id === uid && v.id === Number(req.params.id))) res.sendStatus(404);
    else {
      await deleteItemById(deleteId);
      res.sendStatus(204);
    }
  }


});

app.delete("/list", async (req: Request, res: Response) => {
  if (!req.session.user) res.sendStatus(401);
  else {
    const uid = req.session.user.id;
    await deleteAllItemsByUserId(uid);
    res.sendStatus(204);
  }
});

app.listen(port, () => { console.log(`App is listening to: ${port}`); });