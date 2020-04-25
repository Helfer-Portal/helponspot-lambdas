import {  handler, LambdaInputEvent } from './index'

(async function () {
  const user = {
    firstName: "Max",
    lastName: "Mustermann",
    isGPSLocationAllowed: true,
    email: "test661@tedst.de",
    avatar: "picture.jpg",
    travellingDistance: 101,
    address: {
      houseNumber: "1",
      city: "München",
      street: "Deisenhofenerstrasse",
      postalCode: "81539",
      country: "Germany"
    },
   qualifications: [
      "driversLicence",
      "medicalEducation"
    ]
  }
  const requestObject: LambdaInputEvent = {
    body: JSON.stringify(user)
  }
  const result = await handler(requestObject)
  console.log(JSON.stringify(result))
})()
