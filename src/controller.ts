import { ServerResponse, IncomingMessage } from "http";

export class Controller {
    getAllUsers(response: ServerResponse) {
    }
    getUser(request: IncomingMessage, response: ServerResponse, id: string) {
    }
    createUser(request: IncomingMessage, response: ServerResponse) {
    }
    updateUser(request: IncomingMessage, response: ServerResponse, id: string) {
    }
    deleteUser(request: IncomingMessage, response: ServerResponse, id: string) {
    }
}

export const controller = new Controller();