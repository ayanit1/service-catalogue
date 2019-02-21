// const lodash = require('lodash');

module.exports = (name, data) => {
  const serviceName = name.replace('.', '-');
  const response = data.filter(
    service =>
      service.spec.rules[0].http.paths[0].backend.serviceName === serviceName,
  );

  const array = [];

  response.forEach(element => {
    element.spec.rules.forEach(url => {
      array.push(url.host);
    });
  });

  return array;
};
