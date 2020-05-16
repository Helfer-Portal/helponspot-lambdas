#!/bin/bash

zipFile="common.zip"
commonLayerArn="arn:aws:lambda:eu-central-1:198891906952:layer:common"
modules=(help-on-spot-models)

echo "build layer modules"
for module in $modules
do
  cd ./common/$module
  npm i
  npm run build
  npm prune --production

  mkdir -p ../../nodejs/common/$module
  cp -R dist node_modules ../../nodejs/common/$module
  cd ../..
done

echo "zip layer package"
zip -qq -r $zipFile ./nodejs

echo "publish layer"
commonLayerArnVersion=$(aws lambda publish-layer-version \
          --layer-name "$commonLayerArn" \
          --description "models, database connector,..." \
          --compatible-runtimes "nodejs12.x" \
          --zip-file "fileb://$zipFile" \
          | egrep -o "$commonLayerArn:\d")

echo "clean up"
rm -rf $zipFile nodejs

echo "published layer: $commonLayerArnVersion"