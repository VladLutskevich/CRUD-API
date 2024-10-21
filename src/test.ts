import request from 'supertest';
import {User} from "./user";
import {validate} from "uuid";
import * as dotenv from 'dotenv';
import server from "./index";

dotenv.config();

const mockUser: User = {
    username: 'Testname',
    age: 21,
    hobbies: ['hobbie1', 'hobbie2'],
};

const mockUser2: User = {
    username: 'Testname2',
    age: 22,
    hobbies: ['hobbie11', 'hobbie22'],
};

afterAll(() => {
    server.close();
});

describe('first', () => {

    test('It must be empty array', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('It must create new user and return it', async () => {
        const response = await request(server).post('/api/users').send(mockUser);
        expect(response.statusCode).toBe(201);
        expect(validate(response.body.id)).toBeTruthy();
        expect(response.body.username).toBe(mockUser.username);
        expect(response.body.age).toBe(mockUser.age);
        expect(response.body.hobbies.toString()).toBe(mockUser.hobbies.toString());
    });

    test('It must be array with mock user object', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].username).toBe(mockUser.username);
        expect(response.body[0].age).toBe(mockUser.age);
        expect(response.body[0].hobbies.toString()).toBe(mockUser.hobbies.toString());
    });
});

describe('second', () => {

    let id;

    test('It must be array with mock user object', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].username).toBe(mockUser.username);
        expect(response.body[0].age).toBe(mockUser.age);
        expect(response.body[0].hobbies.toString()).toBe(mockUser.hobbies.toString());
        id = response.body[0].id;
    });

    test('It must be 204 status after removing user', async () => {
        const response = await request(server).delete('/api/users/' + id);
        expect(response.statusCode).toBe(204);
    });

    test('It must be empty array', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe('third', () => {

    let id;

    test('It must be empty array', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('It must create new user and return it', async () => {
        const response = await request(server).post('/api/users').send(mockUser);
        expect(response.statusCode).toBe(201);
        expect(validate(response.body.id)).toBeTruthy();
        expect(response.body.username).toBe(mockUser.username);
        expect(response.body.age).toBe(mockUser.age);
        expect(response.body.hobbies.toString()).toBe(mockUser.hobbies.toString());

        id = response.body.id;
    });

    test('It must be update user error status 400 (not valid uuid)', async () => {
        const response = await request(server).put('/api/users/' + 'wrongId').send(mockUser2);
        expect(response.statusCode).toBe(400);
    });

    test('It must update user and return it', async () => {
        const response = await request(server).put('/api/users/' + id).send(mockUser2);
        expect(response.statusCode).toBe(200);
        expect(validate(response.body.id)).toBeTruthy();
        expect(response.body.username).toBe(mockUser2.username);
        expect(response.body.age).toBe(mockUser2.age);
        expect(response.body.hobbies.toString()).toBe(mockUser2.hobbies.toString());
    });
});