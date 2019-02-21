module.exports = (name, data) => {
  const serviceName = name.replace('.', '-');
  const response = data.filter(
    service => service.http.paths[0].backend.serviceName === serviceName,
  );

  return response.map(element => element.host);
};
