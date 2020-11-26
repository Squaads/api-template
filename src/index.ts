import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import packageJSON from '../package.json';
import apiRouter from './api/api.router';
import mongooseConnector from './repositories/mongoose/mongoose-connector.service';

dotenv.config();

const app = express();

/** Base server middlewares */
app.use(cors());
app.use(bodyParser.json());
morgan('tiny');

/** Db Connector Management */
process.on('SIGINT', async () => {
  try {
    await mongooseConnector.disconnectAllDBs();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});

/** Current Routes */
// const allowUrl = ['login', 'signup'];
// app.use('/api', authMiddleware.allowWhiteListUrls(allowUrl), apiRouter);
app.use('/api', apiRouter);
app.use('/status', (_, res) => {
  res.json({ status: 'OK', version: packageJSON.version });
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`
    Running at http://localhost:${port}
  `)
);
