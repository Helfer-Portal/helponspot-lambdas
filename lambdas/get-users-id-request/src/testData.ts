import { AddressData, RequestData } from '../../../common/help-on-spot-models/dist/models/RestModels'

const userAddresData: AddressData = {
    country: 'Germany',
    city: 'Berlin',
    postalCode: '10178',
    houseNumber: '19',
    street: 'Neue Schönhauser Straße',
    coordinates: [52.5243741, 13.4057372]
}

const requestData1: RequestData = {
    title: 'Close Request',
    address: {
        street: 'Rosenthaler Straße',
        postalCode: '10119',
        houseNumber: '17',
        city: 'Berlin',
        country: 'Germany',
        coordinates: [52.5243773, 13.4035485]
    },
    description: 'desc',
    endDate: '2004-07-11',
    startDate: '2004-07-12',
    isActive: false,
    qualificationKeys: ['physicallyFit']
}

const requestData2: RequestData = {
    title: 'Further Away Request',
    address: {
        street: 'Invalidenstraße',
        postalCode: '10115',
        houseNumber: '160',
        city: 'Berlin',
        country: 'Germany',
        coordinates: [52.5308013, 13.3982963]
    },
    description: 'desc',
    endDate: '2004-07-11',
    startDate: '2004-07-12',
    isActive: false,
    qualificationKeys: ['physicallyFit']
}

const requestData3: RequestData = {
    title: 'Far Away Request',
    address: {
        street: 'Rheinsberger Straße',
        postalCode: '10115',
        houseNumber: '76',
        city: 'Berlin',
        country: 'Germany',
        coordinates: [52.5336404, 13.3935898]
    },
    description: 'desc',
    endDate: '2004-07-11',
    startDate: '2004-07-12',
    isActive: false,
    qualificationKeys: ['physicallyFit']
}

export { userAddresData, requestData1, requestData2, requestData3 }
