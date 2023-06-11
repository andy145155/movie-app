function handler(event) {
  var host = (event.request.headers.host && event.request.headers.host.value) || '';

  if (host.indexOf('www.') === 0) {
    return event.request;
  }

  var queryString = Object.keys(event.request.querystring)
    .map((key) => key + '=' + event.request.querystring[key].value)
    .join('&');

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: {
        value: 'https://www.' + host + event.request.uri + (queryString.length > 0 ? '?' + queryString : ''),
      },
    },
  };
}
