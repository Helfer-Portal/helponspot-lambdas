#!/usr/bin/env bash

npm run build
cd ../../

echo "Include commons in app zip"
zip -r post-user.zip ./lambdas/post-user/dist/** ./lambdas/post-user/node_modules/** ./common/help-on-spot-models/dist ./common/help-on-spot-models/node_modules

echo "deploy lambda"
aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_post-user_dev --zip-file fileb://post-user.zip

rm post-user.zip