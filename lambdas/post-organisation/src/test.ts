import { handler, LambdaInputEvent } from './index'
import { OrganisationData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'

describe('delete organisation handler', () => {
    it('should return status 200', async () => {
        const organisaton: OrganisationData = {
            name: 'huhu',
            address: {
                street: 'Monstraße',
                postalCode: '81543',
                houseNumber: '1b',
                city: 'München',
                country: 'Germany'
            },
            email: 'a@v',
            logoPath: 'string',
            responsibles: ['db8c078f-62c4-4ff6-a689-b18de402b257']
        }
        const requestObject: LambdaInputEvent = {
            body: JSON.stringify(organisaton)
        }
        const result = await handler(requestObject)
        expect(result.statusCode).toEqual(200)
    })
})