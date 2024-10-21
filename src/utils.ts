import {ServerResponse} from "http";

export const sendResponse = (response: ServerResponse, statusCode: number, body: any) => {
    response.statusCode = statusCode;
    response.end(JSON.stringify(body));
};