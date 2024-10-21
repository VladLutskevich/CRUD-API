import * as dotenv from 'dotenv';
import {createServer} from "http";
import requestHandler from "./requestHandler";

const server = createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");
    requestHandler(request, response);
});

dotenv.config();
const port = process.env.PORT;
server.listen(port);