import { handler } from './index'

describe("get qualifications handler", () => {
    it("should return status 200", async () => {
        const result = await handler()
        expect(result.statusCode).toEqual(200)
    })
})
