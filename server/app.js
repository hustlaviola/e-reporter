import express from 'express';
import router from './routes/router';

const app = express();

app.use(express.json());

app.use('/api/v1', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));

export default app;
