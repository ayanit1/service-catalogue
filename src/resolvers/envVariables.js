module.exports = (name, data) => {
  const serviceName = name.replace('.', '-');
  const response = data.find(service => service.metadata.name === serviceName);

  const envVariables = response.spec.template.spec.containers[0].env;

  const array = [];
  envVariables.forEach(variable => {
    if (variable.valueFrom) {
      array.push({
        name: variable.name,
        value: 'REDACTED',
      });
      return;
    }

    array.push(variable);
  });

  return array;
};
