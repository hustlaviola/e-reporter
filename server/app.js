import express from 'express';
import router from './routes/router';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to iReporter');
});

app.use('/api/v1', router);

app.all('/*', (req, res) => {
  res.status(404).send({
    status: res.statusCode,
    error: 'The requested url was not found on this server',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));

export default app;
