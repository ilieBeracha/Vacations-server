import express, { json } from "express";
import cors from 'cors'
import * as dotenv from 'dotenv'
import { UserRoute } from "./5-routes/userRoute";
import { VacationRoute } from "./5-routes/vacationRoute";
import { LikesRoute } from "./5-routes/likesRoute";
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

const fileUpload = require('express-fileupload');

const server = express();

server.use(cors())
server.use(json());
server.use(fileUpload())

server.use(UserRoute)
server.use(VacationRoute)
server.use(LikesRoute)

server.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})