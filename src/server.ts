
import express from 'express';
import PetController from '@src/controllers/pet.controller';
import {loggingMiddleware} from "@src/middleware/log.middleware";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(loggingMiddleware)
app.use('/pets', PetController);
export default app;
