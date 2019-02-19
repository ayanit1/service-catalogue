const request = require('request-promise-native');

module.exports = () =>
  request.get(
    'https://service-catalogue-platform.prod.ctmers.io/services/metadata',
    {
      json: true,
    },
  );
