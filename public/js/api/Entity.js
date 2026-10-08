/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
    let url = this.URL;
    if (data && Object.keys(data).length > 0) {
      const params = new URLSearchParams(data);
      url += '?' + params.toString();
    }
    return createRequest({
      url: url,
      method: 'GET',
      responseType: 'json',
      callback
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    return createRequest({
      url: this.URL,
      method: 'POST',
      responseType: 'json',
      data,
      callback
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    return createRequest({
      url: this.URL + '/',
      method: 'POST',
      responseType: 'json',
      data,
      callback
    });
  }
}
