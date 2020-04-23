#!/usr/bin/env bash

projectName=delete-organisation
zipFile=$projectName.zip

npm run build

zip -r -j $zipFile ./dist/*

echo "deploy lambda"
aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_${projectName}_dev --zip-file fileb://$zipFile

rm $zipFile