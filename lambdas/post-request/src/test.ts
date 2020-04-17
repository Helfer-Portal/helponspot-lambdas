import {handler, LambdaInputEvent} from './index'
import {RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";

(async function () {
    const organisaton: RequestData = {
        title: "huhu",
        address: {
            street: "string",
            postalCode: "string",
            houseNumber: "string",
            city: "string",
            country: "string"
        },
        description: "desc",
        endDate: new Date(),
        startDate: new Date(),
        isActive: false,
        organisationId: "123",
        qualifiactionKeys: [""]

    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton)
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
