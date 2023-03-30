import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({limit: '20MB'}));
// app.use(jsend());
app.use(express.urlencoded({extended: false, limit: '50MB'}));
app.use(cookieParser());

app.use('/', (req, res) => {
  res.json({info: 'rndmcodeguy : library api server. Please visit health route for more information.'});
});

export {app};
