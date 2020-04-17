import {handler, LambdaInputEvent} from './index'
import {OrganisationData} from "../../../common/help-on-spot-models/dist/models/RestModels";

(async function () {
    const organisaton: OrganisationData = {
        name: "huhu",
        address: {
            street: "string",
            postalCode: "string",
            houseNumber: "string",
            city: "string",
            country: "string"
        },
        email: "a@v",
        logoPath: "string",
        responsibles: ["5bee3dc3-a0bf-4d19-bd94-87451feb0c3c"]
    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton)
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
