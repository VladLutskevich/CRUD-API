import {IncomingMessage, ServerResponse} from "http";

export const sendResponse = (response: ServerResponse, statusCode: number, body: any) => {
    response.statusCode = statusCode;
    response.end(JSON.stringify(body));
};

export const parseData = (request: IncomingMessage, response: ServerResponse) => {
    return new Promise((resolve) => {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString()
        });
        request.on('end', () => {
            try {
                let data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                sendResponse(response, 500,'Data parsing error');
            }
        })
    })
};