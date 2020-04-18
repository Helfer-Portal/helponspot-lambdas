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
        responsibles: ["db8c078f-62c4-4ff6-a689-b18de402b257"]
    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton)
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
