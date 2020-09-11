// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', []);

  this.get('/saml/check', {
    ssoEnabled: false,
  });

  this.get('/configurations/entries', {
    configs: [],
  });
  this.post('/bl-users/login', () => {
    return new Response(
      201,
      {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      },
      {
        user: {
          id: 'test',
          username: 'testuser',
          personal: {
            lastName: 'User',
            firstName: 'Test',
            email: 'user@folio.org',
          },
        },
        permissions: {
          permissions: [],
        },
      }
    );
  });
  this.get('/usage-data-providers');
  this.get('/usage-data-providers/:id', (schema, request) => {
    return schema.usageDataProviders.find(request.params.id).attrs;
  });

  this.get('/aggregator-settings', () => {
    return {
      aggregatorSettings: [
        {
          id: '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
          label: 'German National Statistics Server',
          serviceType: 'NSS',
          serviceUrl: 'https://sushi.url-to-nss.de/Sushiservice/GetReport',
          aggregatorConfig: {
            reportRelease: '4',
            apiKey: 'xxx',
            requestorId: 'xxx',
            customerId: 'xxx',
          },
          accountConfig: {
            configType: 'Mail',
            configMail: 'accounts@example.org',
            displayContact: ['John Doe, Phone +49 0000 0000000'],
          },
          metadata: {
            createdDate: '2020-09-11T02:45:22.757+00:00',
            updatedDate: '2020-09-11T02:45:22.757+00:00',
          },
        },
      ],
      totalRecords: 1,
    };
  });
}
