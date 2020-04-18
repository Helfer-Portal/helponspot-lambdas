#!/usr/bin/env bash

projectName=put-volunteer

npm i
npm prune --production
npm run build
cd ../../

echo "Include commons in app zip"
rm ${projectName}.zip
zip -qq -r ${projectName}.zip ./lambdas/${projectName}/dist/** ./lambdas/${projectName}/node_modules/** ./common/help-on-spot-models/dist ./common/help-on-spot-models/node_modules

echo "deploy lambda"
aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_${projectName}_dev --zip-file fileb://${projectName}.zip

rm ${projectName}.zip