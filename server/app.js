import express from 'express';
import router from './usingDB/routes/router';
import ErrorController from './usingDB/utils/ErrorController';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to iReporter');
});

app.use('/api/v1', router);

app.all('/*', (req, res) => ErrorController.routeError(res));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));

export default app;
