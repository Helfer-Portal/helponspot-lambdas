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
        responsibles: ["0EFCDCB7-D876-4D38-8237-8423B8576D72"]
    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton)
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
