import express from 'express'
import apiRouter from './router'

const app = express();

app.use(express.static('public'));
app.use(apiRouter);

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server listening on port: ${port}`));