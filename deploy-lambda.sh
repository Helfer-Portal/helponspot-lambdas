#!/usr/bin/env bash
set -e

availableStages=(dev prod)
PS3="Deploy to which stage? "
select answer in "${availableStages[@]}"
do
case "$REPLY" in
    *)  echo "target stage: "${answer}; deploymentStage=${answer}; break;;
esac
done


availableLambdas=(delete-organisation delete-user delete-request get-organisation-requests get-organisations get-qualifications get-request-id get-user get-users-id-request get-volunteers patch-user post-organisation post-request post-user put-volunteer)
selectedLambdas=()
PS3="Which Lambda do you want to deploy? ('all' is an option)"
select answer in "${availableLambdas[@]}"
do
case "$REPLY" in
    all) echo 'deploying all lambdas'; selectedLambdas=("${availableLambdas[@]}");break;;
    *)  echo ${answer}; selectedLambdas=${answer}; break;;
esac
done

echo "deploy layer"
source ./deploy-layers.sh

for lambda in "${selectedLambdas[@]}"
do
    # build zip package
    echo Deployoing lambda: "${lambda}"
    cd ./lambdas/${lambda}
    npm i
    npm run build
    npm prune --production
    cd ../../
    echo "build zip package for: ${lambda}"
    zip -qq -r ${lambda}.zip ./lambdas/${lambda}/dist/** ./lambdas/${lambda}/node_modules/** ./common/help-on-spot-models/dist ./common/help-on-spot-models/node_modules

    # check if lambda function exists
    functionName=HoS_${lambda}_${deploymentStage}
    set +e
    lambdaFunctionExists=`aws lambda list-functions | grep ${functionName}`
    set -e
    if [[ -z "$lambdaFunctionExists" ]]
    then
        echo "Creating new lambda function ${functionName}"
        handler="lambdas/${lambda}/dist/index.handler"
        role="arn:aws:iam::198891906952:role/HoS-lambda-role"
        # not really important just needs to be unique
        statementId="${lambda}-cad7-4775-bf56-36baa21030a7"
        envs=`cat ./.lambda-envs.txt`

        aws lambda create-function --function-name ${functionName} --runtime nodejs12.x --role ${role} --handler ${handler} --zip-file fileb://${lambda}.zip --environment "Variables={${envs}}"
        # add trigger that allows api gateway to call the lambda
        aws lambda add-permission  --function-name ${functionName} --statement-id ${statementId}  --action "lambda:InvokeFunction" --principal "apigateway.amazonaws.com" --action lambda:InvokeFunction --source-arn "arn:aws:execute-api:eu-central-1:198891906952:js7pyl1b87/*"

    else
        echo "Updating existing lambda function ${functionName}"
        aws lambda update-function-code --function-name arn:aws:lambda:eu-central-1:198891906952:function:${functionName} --zip-file fileb://${lambda}.zip
    fi

    echo "update lambda with newly published layer"
    aws lambda update-function-configuration \
              --function-name arn:aws:lambda:eu-central-1:198891906952:function:${functionName} \
              --layers $commonLayerArnVersion

    rm ${lambda}.zip
done
echo "Finished deployment"

