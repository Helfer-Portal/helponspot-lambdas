import {handler, LambdaInputEvent} from './index';

(async function () {
    const inputEvent: LambdaInputEvent = {
        pathParameters: { 
            organisationId: "db8c078f-62c4-4ff6-a689-b18de402b252"
        }
    };
    const result = await handler(inputEvent);

    console.log('result\n--------------------\n');
    console.log(JSON.stringify(result));
})()
