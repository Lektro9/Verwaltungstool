import express, { Request, Response } from 'express';

const app = express();
const port = 3004;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Ich bin die Personenverwaltung!');
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
