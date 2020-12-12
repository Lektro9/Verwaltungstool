import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Ich verarbeite Daten zur Mannschaftsverwaltung!');
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
