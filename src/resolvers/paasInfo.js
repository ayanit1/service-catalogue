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
  podInfoResolver: (name, data) => {
    const { podInfo } = findNameInData(name, data);

    return podInfo;
  },

  isOnPaasResolver: (name, data) => {
    const response = findNameInData(name, data);

    return response !== undefined;
  },
  serviceUrlResolver: (name, data) => {
    const serviceName = name.replace('.', '-');
    const response = data.filter(
      service => service.http.paths[0].backend.serviceName === serviceName,
    );

    return response.map(element => element.host);
  },
};
