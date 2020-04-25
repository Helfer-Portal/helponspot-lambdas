import {  handler } from './index'

(async function () {
  const event = {
    version: "1",
    region: "eu-central-1",
    userPoolId: "eu-central-1_Ydd5t1uwk",
    userName: "max.mustermann",
    callerContext: {
      awsSdkVersion: "aws-sdk-unknown-unknown",
      clientId: "1u97cevfn0bm393ngb9tffqbd5"
    },
    triggerSource: "PostAuthentication_Authentication",
    request: {
      userAttributes: {
        sub: "b3673ee2-9mju-49cc-t67u-44d05e5f5861",
        email_verified: true,
        email: "max.musterman@example.com"
      },
      newDeviceUsed: false
    },
    response: {}
  };

  const context = {
    functionVersion: "1",
    functionName: "post-confirmation-lambda"
  };

  await handler(event, context, (error: any, response: any) => { 
    console.log(response);
  });
})()
