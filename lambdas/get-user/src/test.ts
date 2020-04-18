import {handler, LambdaInputEvent} from "./index";

(async function () {

  const requestObject: LambdaInputEvent = {
    pathParameters: {
      userId: "91D2E5DD-0CDF-4D1E-83F1-962A95822307"
    }
  }

  const result = await handler(requestObject)

  console.log(JSON.stringify(result))
})()
