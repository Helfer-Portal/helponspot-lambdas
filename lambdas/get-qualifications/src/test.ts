import { handler } from './index'
;(async function () {
    const requestObject = {}

    // fill in a qualification
    const result = await handler()

    console.log(JSON.stringify(result))
})()
