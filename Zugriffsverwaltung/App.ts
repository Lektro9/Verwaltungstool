import express, { Request, Response } from 'express';

const app = express();
const port = 3005;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Ich bin die Zugriffsverwaltung!');
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
