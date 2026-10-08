/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url = '',
    method = 'GET',
    data = null,
    responseType = 'json', // 'json' или 'text'
    callback = () => {}
  } = options;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = () => {
    let responseData;

    try {
      if (responseType === 'json') {
        // Пустой ответ (например, 204 No Content) может вызвать ошибку парсинга
        responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } else {
        responseData = xhr.responseText;
      }
    } catch (e) {
      return callback(new Error('Не удалось распарсить ответ сервера'), null);
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, responseData);
    } else {
      callback(new Error(`Ошибка сервера: ${xhr.status}`), {
        status: xhr.status,
        data: responseData
      });
    }
  };

  xhr.onerror = () => {
    callback(new Error('Сетевая ошибка: не удалось соединиться с сервером'), null);
  };

  if (data !== null) {
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }

  return xhr;
};
