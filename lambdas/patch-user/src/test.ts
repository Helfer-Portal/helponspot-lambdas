import {  handler, LambdaInputEvent } from './index'

(async function () {
  const user = {
    firstName: "Max neu",
    lastName: "Mustermann neu",
    isGPSLocationAllowed: true,
    email: "test@neu123.de",
    avatar: "new_picture.jpg",
    address: {
      houseNumber: "1337 asdas b",
      city: "Essen adsad",
      street: "Hauptsadasstraße",
      postalCode: "123 asd",
      country: "Malt asdasa"
    },
   qualifications: [
      "medicalEducation",
      "driversLicence"
    ]
  }
  const requestObject: LambdaInputEvent = {
    body: JSON.stringify(user),
    pathParameters: {
      userId: "C898EF75-AC18-4197-BA4D-E384D727A7C0"
    }
  }
  const result = await handler(requestObject)
  console.log(JSON.stringify(result))
})()
