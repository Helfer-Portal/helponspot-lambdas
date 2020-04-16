import {handler, LambdaInputEvent, OrganisationData} from './index'

(async function () {
    const organisaton: OrganisationData = {
        name: "ba",
        address: {
            street: "string",
            postalCode: "string",
            houseNumber: "string",
            city: "string",
            country: "string"
        },
        logoPath: "string",
        responsibles: ["hand"]
    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton)
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
