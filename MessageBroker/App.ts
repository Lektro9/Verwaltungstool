import express, { Request, Response } from 'express';

const app = express();
const port = 3002;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Ich bin der MessageBroker!');
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
