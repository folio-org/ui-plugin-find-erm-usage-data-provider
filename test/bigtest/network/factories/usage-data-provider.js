import faker from 'faker';
import Factory from './application';

export default Factory.extend({
  label: (i) => 'UDP ' + i,
  descriprion: (i) => 'Description ' + i,
  harvestingConfig: (i) => ({
    harvestingStatus: () => faker.random.boolean(),
    harvestVia: 'sushi',
    reportRelease: 4,
    requestedReports: ['JR1', 'JR2'],
    harvestingStart: '2018-01',
    sushiConfig: {
      serviceType: 'cs41',
      serviceUrl: 'www.sushiUrl-' + i + '.de',
    },
  }),
  harvestingDate: () => '2020-01-22T13:26:40.687+0000',
  sushiCredentials: (i) => ({
    customerId: 'customer_' + i,
    requestorId: 'requestor_' + i,
  }),
});
