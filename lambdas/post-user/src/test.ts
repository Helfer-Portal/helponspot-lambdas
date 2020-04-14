import {  handler, LambdaInputEvent } from './index'

(async function () {
  const user = {
    firstName: "Max",
    lastName: "Mustermann",
    isGPSLocationAllowed: true,
    email: "test@test.de",
    avatar: "picture.jpg"
  }
  const requestObject: LambdaInputEvent = {
    body: JSON.stringify(user)
  }
  const result = await handler(requestObject)
  console.log(JSON.stringify(result))
})()
