## Installation

```bash
$ npm install
```
In docker-compose.yml change 'POSTGRES_PASSWORD' and 'POSTGRES_USER' to your preferred ones.

Rename .env.example to .env

Change 'username' and 'password' in .env to the same as in docker-compose.yml

Change 'db_name' in .env to 'todo_app' - has to be same as 'POSTGRES_DB' value in docker-compose.yml

Change 'AT_SECRET'(access token secret) and 'RT_SECRET'(refresh token secret) in .env to whatever you like.

Start docker container
```bash
$ docker compose up todo_app -d
```

## Running database migrations

Install prisma
```bash
$ npm install prisma
```

Deploy prisma migrations
```bash
$ prisma migrate deploy
```

## Running the app

Build the app
```bash
$ npm run build
```

Run the app
```bash
$ npm run start
```