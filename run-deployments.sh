#!/usr/bin/env bash

set -e

lambdas=(get-organisation-requests get-organisations get-qualifications get-request-id get-user get-users-id-request get-volunteers patch-user post-organisation post-request post-user put-volunteer)
deploymentStage='dev'

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
    npm prune --production
    npm i
    npm run build
    cd ../../

    echo "build zip package for: ${lambda}"
    zip -qq -r ${lambda}.zip ./lambdas/${lambda}/dist/** ./lambdas/${lambda}/node_modules/** ./common/help-on-spot-models/dist ./common/help-on-spot-models/node_modules

    echo "deploy lambda: ${lambda}"
    aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:HoS_${lambda}_${deploymentStage} --zip-file fileb://${lambda}.zip

    rm ${lambda}.zip
done




