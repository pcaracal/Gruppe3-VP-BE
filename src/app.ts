import { Application, Request, Response } from 'express';
import express from 'express';
const app: Application = express();
const port = 3000;
app.use(express.json());




app.listen(port, () => { console.log(`App is listening to: ${port}`); });