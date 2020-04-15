import {  handler, LambdaInputEvent } from './index'

(async function () {
  const requestObject: LambdaInputEvent = {}
  
  // fill in a qualification
  const result = await handler(requestObject)

  console.log(JSON.stringify(result))
})()
