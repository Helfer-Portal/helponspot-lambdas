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
        qualifiactionKeys: [""]

    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(organisaton),
        path: '/organisations/1677698E-48B5-4D54-A84B-79791CDFCDA0/requests'
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
