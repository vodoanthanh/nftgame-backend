# Moon Crypto Backend

This is the backend of the Moon Crypto project.

## Installation

Run `yarn` to install all the packages for the project

## Usage

### Environment variables

Please check the file `.env.example` file to create the local `.env` file to run the server.
The database config will be based on the the environment variable `NODE_ENV`.

Required environment variables to run the server are:
- `SECRET_KEY`, used for JWT Authentication
- `PRIVATE_KEY`
- `PROVIDER_URL`, blockchain JSON-RPC URL
- `DEPLOYER_PRIVATE_KEY`, secret key of deployer.

In development, you can make change to the `src/config/databases.ts` file to connect to your developement database. In production, databases environment variables are required to connect to production database

### Development

Run `yarn dev` to spin up the development environment. The default endpoint will be `http://localhost:3000`.
The port can be changed by including the environment variable `PORT`.
The database connnection config can be changed in `src/config` folder. DO NOT CHANGE THE PRODUCTION CONFIG.

### Production

Run `yarn start` to start the server. The start script will automatically build, run the migrations, and spin up the server with environment variable `NODE_ENV=production`.
When running the app in production, databases environment need to be set to be connected to the database. You need to set database variables including `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_HOST`

### Database

Before running any script for database, remember to run `yarn build` to build the sources into `dist` folder before running the database scripts.

#### Create database

Run `yarn db:create` to create database based on the config in the file `src/config/databases.ts`

#### Run migrations

Run `yarn db:migrate` to run all pending migrations. The script will build the files and then run the migrations from `dist` folder.
The migrations will be used to create and update table models.

#### Create migrations

Run `yarn db:migrate:create` to create a migration file. The option `--name` is needed to create the migration file.
The file will be created in `.js` extension, and you should change it into a `.ts` file. The file should [named export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) 2 functions `up`, and `down`, which will be used in running migrations and undoing migrations, respectively.

#### Undo a migration

Run `yarn db:migrate:undo` to undo the previous migration you made to the database.

#### Undo all migrations

Run `yarn db:migrate:undo:all` to undo all migrations you made to the database.

## Docker

You can use docker to quickly run this app by running `yarn docker`. You also need to set all database environment variables into the file `.env` before building the image
