# Help On Spot Lambdas

This repo contains all aws lambda functions, plus a commons library.

## Common Packages

### help-on-spot-models

Contains all database models and exposes them.

## Lambdas

### database

This lambda is used for migrations, setting up database schemas and such

### post-user

This lambda is used for creating users


## start locally
* ```docker run --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345 postgres:10.11```
* ts-node ./src/test.ts`