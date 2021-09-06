# Squaads API <!-- omit in toc -->

> A Rest API template developed by Squaads

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Main commands](#main-commands)
    - [Development](#development)
    - [Production](#production)
    - [Test](#test)
    - [Lint](#lint)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Getting started

### Prerequisites

**Node.js** is required to run the application.

Visit [this page](https://nodejs.org/en/download/) for download instructions.

### Installation

Install the required dependencies:

`$ npm install`

### Configuration

The application relies on environment variables to connect to various services.

To configure these variables:

- Copy and rename the `src/environments/.env.example` to `src/environments/.env.[dev|prod|release]`
- Copy and rename the `src/environments/firebase/admin_services_account/adminsdk.example.json` to `src/environments/firebase/admin_services_account/adminsdk.[dev|prod|release].json`
- Copy and rename the `src/environments/firebase/client_config/firebase.config.example.ts` to `src/environments/firebase/client_config/firebase.config.[dev|prod|release].ts`
- Open the files and fill then with the required values

Aditionaly, you can configure your own tsconfig for every environment. You can check the different current files in root folder called `tsconfig.prod.json` ,  `tsconfig.staging.json`  and  `tsconfig.dev.json`.  They are associate with the equivalent command, for example `npm run staging` use a `tsc --build tsconfig.staging`.

### Main commands

#### Development

Start a local development server with the following command:

`$ npm run dev`

This will:

- Fire up a local web server at `localhost` on port 8080 or `PORT` if defined
- Set the environments files to the `.dev` 
- Watch for changes in the source files allowing the server to reload automatically

#### Production

For production use, start the server with:

`$ npm run prod`


#### Release

For release use, start the server with:

`$ npm run release`

### About deploys on Heroku

This api has a Procfile but you can check you have 3 differents Procfile to use. They are associated with the scripts on package.json

The file Procfile is ignored on .gitignore 

### Annotations 

Reglas posibles de la estructura:

Un manager se encarga de la lógica general, la lógica de negocio

Un modelo se encarga de la lógica que está relacionada con la lógica de la base de datos.

Un manager, en medio de su operativa, puede decidir llamar a otro manager o incluso a otros modelos.

Un modelo puede en algunos casos necesitar llamar a otro modelo, para que lea o guarde en otra tabla

Ejemplo de cuando un modelo necesita llamar a otro modelo:

El meter un mensaje en la tabla mensajes implica guardar el timestamp de ultima vez que escribiste en el user. Pues el message.model.ts llama a user.model.ts para meter el timestamp
