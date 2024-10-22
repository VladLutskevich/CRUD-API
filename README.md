# CRUD API

## Start

1. Clone repo:

```shell
$ git clone https://github.com/VladLutskevich/CRUD-API.git
```

2. Install NPM packages:

```shell
$ npm install
```

3. Run project in Dev mode

```shell
$ npm run start:dev
```

4. Create project build

```shell
$ npm run start:prod
```

## How to use

To test the API, you can use Postman or any other similar tool (HTTP client).

- **GET:**

  - `api/users` - get all users
  - `api/user/:userId` - get specific user

- **POST:**

  - `api/users` - create new user

- **PUT:**

  - `api/user/:userId` - update existing person

- **DELETE:**
  - `api/user/:userId` - delete user

User object model:

- "username": `string`,
- "age": `number`,
- "hobbies": `string`[] or []

## Testing

Run tests:

```shell
$ npm run test
```