#!/usr/bin/env bash

tsc
mkdir -p ./foo/bar/common/help-on-spot-models/dist
cp -r ./../../common/help-on-spot-models/dist/** ./foo/bar/common/help-on-spot-models/dist
zip -r app.zip ./dist/** ./node_modules/** ./foo/bar/common/help-on-spot-models/dist

rm -r ./common/
aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_post-user_dev --zip-file fileb://app.zip