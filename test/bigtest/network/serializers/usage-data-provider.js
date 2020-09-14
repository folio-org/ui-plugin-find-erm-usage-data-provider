import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.usageDataProviders)) {
      return {
        ...json,
        totalRecords: json.usageDataProviders.length,
      };
    } else {
      return json.usageDataProviders;
    }
  },
});
