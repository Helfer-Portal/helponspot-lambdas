#!/usr/bin/env bash

set -e
lambdas=(delete-organisation delete-user delete-request get-organisation-requests get-organisations get-qualifications get-request-id get-user get-users-id-request get-volunteers patch-user post-organisation post-request post-user put-volunteer)
deploymentStage='dev'
currentLayerVersion=3
selectedLambdas=()

PS3="Which Lambda do you want to deploy? ('all' is an option)"
select answer in "${lambdas[@]}"
do
case "$REPLY" in
    all) echo 'deploying all lambdas'; selectedLambdas=("${lambdas[@]}");break;;
    *)  echo ${answer}; selectedLambdas=${answer}; break;;
esac
done

for lambda in "${selectedLambdas[@]}"
do
    echo Deployoing lambda: "${lambda}"
    cd ./lambdas/${lambda}
    npm i
    npm run build
    npm prune --production
    cd ../../

    echo "build zip package for: ${lambda}"
    zip -qq -r ${lambda}.zip ./lambdas/${lambda}/dist/** ./lambdas/${lambda}/node_modules/**

    echo "deploy lambda: ${lambda}"
    aws lambda update-function-code \
                --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_${lambda}_${deploymentStage} \
                --zip-file fileb://${lambda}.zip

    echo "update lambdas configuration"
    aws lambda update-function-configuration \
                --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_${lambda}_${deploymentStage} \
                --layers arn:aws:lambda:eu-central-1:198891906952:layer:common:$currentLayerVersion
        
    rm ${lambda}.zip
done

echo "Finished deployment"