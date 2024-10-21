import {sendResponse} from "./utils";
import {IncomingMessage, ServerResponse} from 'node:http';
import {controller} from './controller';

const RequestHandler = (request: IncomingMessage, response: ServerResponse) => {
    const {url, method} = request;

    if ((url! === '/api/users' || url! === '/api/users/') && method === 'GET') {
        controller.getAllUsers(response)
    } else if (url!.startsWith('/api/users/') && method === 'GET') {
        let id = url!.replace('/api/users/', '');
        controller.getUser(request, response, id)
    } else if ((url! === '/api/users' || url! === '/api/users/') && method === "POST") {
        controller.createUser(request, response)
    } else if (url!.startsWith('/api/users/') && method === 'PUT') {
        let id = url!.replace('/api/users/', '');
        controller.updateUser(request, response, id)
    } else if (url!.startsWith('/api/users/') && method === 'DELETE') {
        let id = url!.replace('/api/users/', '');
        controller.deleteUser(request, response, id)
    } else {
        sendResponse(response, 500, 'Not found');
    }
}

export default RequestHandler;