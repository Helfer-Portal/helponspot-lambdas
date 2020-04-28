#!/bin/bash
zipFile="common.zip"
modules=(help-on-spot-models)

echo "build modules"
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

echo "build zip package"
zip -qq -r $zipFile ./nodejs

echo "publish layer"
aws lambda publish-layer-version \
          --layer-name "arn:aws:lambda:eu-central-1:198891906952:layer:common" \
          --description "models, database connector,..." \
          --compatible-runtimes "nodejs12.x" \
          --zip-file "fileb://$zipFile" \
          --debug

echo "clean up"
rm -rf $zipFile nodejs

echo "deployment finished"