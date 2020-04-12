#!/usr/bin/env bash

npm run build
aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_post-user_dev --zip-file fileb://app.zip
