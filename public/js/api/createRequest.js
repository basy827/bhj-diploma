/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url = '',
    method = 'GET',
    data = null,
    callback = () => {},
    responseType = 'json'
  } = options;

  const xhr = new XMLHttpRequest();

  let requestUrl = url;
  if (method === 'GET' && data && Object.keys(data).length > 0) {
    const params = new URLSearchParams();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined && data[key] !== null) {
        params.append(key, data[key]);
      }
    }
    const query = params.toString();
    if (query) {
      requestUrl += (url.includes('?') ? '&' : '?') + query;
    }
  }

  xhr.open(method, requestUrl);
  xhr.responseType = responseType;

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      callback(new Error(`Ошибка сервера: ${xhr.status}`), xhr.response);
    }
  };

  xhr.onerror = () => {
    callback(new Error('Сетевая ошибка: не удалось соединиться с сервером'), null);
  };

  if (method !== 'GET' && data && Object.keys(data).length > 0) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }

  return xhr;
};
