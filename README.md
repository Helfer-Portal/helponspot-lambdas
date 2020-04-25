# Help On Spot Lambdas

This repo contains all aws lambda functions, plus a commons library.

## Structure

* `/common` includes common libraries that include code that is shared between lambdas
* ``/common/help-on-spot-models`` - REST models + DB access


* `/lambdas` includes the lambda function code. General idea: one lambda function for every API endpoint


## Start locally
* Setup a local postgres with docker command

```docker run --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345 postgres:10.11```

* `npm run test` - in any lambda folder

### Local Postgis DB

* If you need postgis support for your local database use:

```docker run --name "postgis" -p 5432:5432 -d -t kartoza/postgis:10.0-2.4```

* You can then login with user "docker", password "docker" and databasename "gis"

### Local environment variables
* Create a local .env file in the root directory of each lambda  

Available .env variables:
```
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
GEOSERVICE_LAMBDA_NAME=
```

## Deploy lambdas to AWS
* install aws cli
* setup your AWS credentials wth `aws configure`
* run ``./deploy.sh`` in project root
* select the lambda you want to deploy or `all` to deploy every lambda

## Steps to create a new lambda function
* create a new folder in ``/lambdas``, name it according to the served endpoint
* setup a typescript project, make sure the tsconfig has a reference to the commons project you want to include
* add folder name to `deploy.sh` script's lambda array (Line 5)
* create a new lambda function in region eu-central-1 (AWS console, CLI, whatever) 
* name it `HoS_{folder}_dev`
* set handler path as it is found in the .zip `lambdas/{folder}/dist/index.handler`
* set environment variables if new functions needs DB access
* point API gateway's endpoint 'Integration Request' to new lambda
* assign correct input/output models or create them if they don't exist yet
* if changes have been made to the API, export OpenAPI docs and commit them to `Helfer-Portal/helponspot-api-gateway` repo
* if your lambda uses the geolocation service, you need to:
  * give the lambda role of your service the `InvokeGeoLocationLambda` policy
  * give the lambda the `GEOSERVIE_LAMBDA_NAME` env variable

## RDS Postgres DB
* The application is using an AWS RDS instance with postgres version 10.11
* If you need to enable the PostGIS extension on the db you need to execute `create extension postgis;` for enabling the extension
  * You need the PostGIS extension for saving spatial data like "point" of address 
