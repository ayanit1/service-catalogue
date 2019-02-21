const lodash = require('lodash');

module.exports = (name, data) => {
  const serviceName = name.replace('.', '-');
  const response = data.find(service => service.name === serviceName);

  if (lodash.get(response, 'envs') === undefined) {
    return undefined;
  }

  return response.envs.map(variable => {
    if (variable.valueFrom) {
      return {
        name: variable.name,
        value: 'REDACTED',
      };
    }

    return variable;
  });
};
