const lodash = require('lodash');

const findNameInData = (name, data) => {
  const serviceName = name.replace('.', '-');
  return data.find(service => service.name === serviceName);
};

module.exports = {
  envVariableResolver: (name, data) => {
    const response = findNameInData(name, data);

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
  },
  podResolver: (name, data) => {
    const response = findNameInData(name, data);

    return lodash.get(response, 'response.pods');
  },

  isOnPaasResolver: (name, data) => {
    const response = findNameInData(name, data);

    return response !== undefined;
  },
};
