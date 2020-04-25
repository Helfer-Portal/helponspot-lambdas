import { handler, LambdaInputEvent } from './index';
import { OrganisationData, AddressData } from '../../../common/help-on-spot-models/src/models/RestModels';
import { Database } from '../../../common/help-on-spot-models/src/utils/Database';
import Organisation from '../../../common/help-on-spot-models/src/entity/Organisation';
import User from '../../../common/help-on-spot-models/src/entity/User';

describe('delete organisation handler', () => {
    it('should return status 500 when organisation id is invalid', async () => {
        const inputEvent: LambdaInputEvent = {
            pathParameters: { 
                organisationId: "invalid-id"
            }
        };

        const result = await handler(inputEvent);
        expect(result.statusCode).toEqual(500);
    });

    it('should return status 200', async () => {
        const createdOrganisation: Organisation = await createOrganisation();
        const inputEvent: LambdaInputEvent = {
            pathParameters: { 
                organisationId: createdOrganisation.id!
            }
        };
        const result = await handler(inputEvent);
        expect(result.statusCode).toEqual(200);
    });
})

async function createOrganisation(): Promise<Organisation> {
    const connection = await new Database().getConnection();
    const userRepo = connection!.getRepository(User);
    const orgRepo = connection!.getRepository(Organisation);

    const randomEmail = Math.random().toString(36).substring(7) + '@test';
    const user = await userRepo.save(new User(randomEmail, false, [], 'Test', 'User'));
    const addressData: AddressData = {city: 'c', country: 'c', houseNumber: 'h', postalCode: '1', street: 's'};
    const organisationData: OrganisationData = {address: addressData, email: '@email', logoPath: 'lp', name: 'n', responsibles: []};
    const organisation = await orgRepo.save(new Organisation(organisationData, [user]));
    await connection!.close();

    return organisation;
}