import { ServerResponse, IncomingMessage } from "http";
import {sendResponse, parseData} from "./utils";
import {v4, validate} from "uuid";
import {users} from "./user";

export class Controller {
    getAllUsers(response: ServerResponse) {
        if (process.env.CLUSTER_MODE) {
            process.send({
                msg: 'getAllUsers',
                pid: process.pid
            });
            process.on('message', ({database}) => {
                sendResponse(response, 200, database)
            })
        } else {
            sendResponse(response, 200, users)
        }
    }
    async getUser(request: IncomingMessage, response: ServerResponse, id:string) {
        if (!validate(id)) {
            sendResponse(response, 400,'Uuid is not valid');
        } if (process.env.CLUSTER_MODE) {
            process.send({
                msg: 'getAllUsers',
                pid: process.pid
            });
            process.on('message', ({database}) => {
                sendResponse(response, 200, database)
                if (database.find(el => el.id === id)) {
                    let user = database.find(el => el.id === id)
                    sendResponse(response, 200, user)
                } else {
                    sendResponse(response, 404,'User with this id not found');
                }
            })
        } else if (!process.env.CLUSTER_MODE) {
            if (users.find(el => el.id === id)) {
                let user = users.find(el => el.id === id)
                sendResponse(response, 200, user)
            } else {
                sendResponse(response, 404,'User with this id not found');
            }
        }
    }
    async createUser(request: IncomingMessage, response: ServerResponse) {
        try {
            let body: any = await parseData(request, response);
            const isDataCorrect =   body.hasOwnProperty("username") &&
                                    body.hasOwnProperty("age") &&
                                    body.hasOwnProperty("hobbies");
            if (isDataCorrect) {
                const user = {
                    id: v4(),
                    username: body.username,
                    age: body.age,
                    hobbies: body.hobbies,
                };
                if (process.env.CLUSTER_MODE) {
                    process.send({
                        msg: 'createUser',
                        addedUser: user,
                        pid: process.pid
                    });
                } else {
                    users.push(user);
                }
                sendResponse(response, 201,  user);
            } else {
                sendResponse(response, 400,'Request does not contain required fields');
            }
        } catch {
            sendResponse(response, 500,'Incorrect request data');
        }
    }
    async updateUser(request: IncomingMessage, response: ServerResponse, id:string) {
        if (!validate(id)) {
            sendResponse(response, 400,'Uuid is not valid');
        } else if (process.env.CLUSTER_MODE) {
            process.send({
                msg: 'getAllUsers',
                pid: process.pid
            });
            process.on('message', async ({database}) => {
                if (database.find(el => el.id === id)) {
                    try {
                        let db = [...database]
                        let body: any = await parseData(request, response);
                        let user = {...db.find(el => el.id === id), ...body}
                        let index = db.findIndex(el => el.id === id);
                        db[index] = user;
                        process.send({
                            msg: 'updateAllDb',
                            db: db,
                            pid: process.pid
                        });
                        sendResponse(response, 200, user)
                    } catch {
                        sendResponse(response, 500,'Incorrect request data');
                    }
                } else {
                    sendResponse(response, 404,'User with this id not found');
                }
            })
        } else if (!process.env.CLUSTER_MODE) {
            if (users.find(el => el.id === id)) {
                try {
                    let body: any = await parseData(request, response);
                    let user = {...users.find(el => el.id === id), ...body}
                    let index = users.findIndex(el => el.id === id);
                    users[index] = user;
                    sendResponse(response, 200, user)
                } catch {
                    sendResponse(response, 500,'Incorrect request data');
                }
            } else {
                sendResponse(response, 404,'User with this id not found');
            }
        }

    }
    deleteUser(request: IncomingMessage, response: ServerResponse, id:string) {
        if (!validate(id)) {
            sendResponse(response, 400,'Uuid is not valid');
        } else if (process.env.CLUSTER_MODE) {
            process.send({
                msg: 'getAllUsers',
                pid: process.pid
            });
            process.on('message', ({database}) => {
                let db = [...database];
                if (db.find(el => el.id === id)) {
                    let index = db.findIndex(el => el.id === id);
                    db.splice(index, 1);
                    process.send({
                        msg: 'updateAllDb',
                        db: db,
                        pid: process.pid
                    });
                    sendResponse(response, 204, 'User record deleted')
                } else {
                    sendResponse(response, 404,'User with this id not found');
                }
            })
        } else if (!process.env.CLUSTER_MODE) {
            if (users.find(el => el.id === id)) {
                let index = users.findIndex(el => el.id === id);
                users.splice(index, 1);
                sendResponse(response, 204, 'User record deleted')
            } else {
                sendResponse(response, 404,'User with this id not found');
            }
        }
    }
}

export const controller = new Controller()