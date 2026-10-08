/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static get URL() {
    return '/account';
  }

  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback) {
    return createRequest({
      url: this.URL + '/' + id,
      method: 'GET',
      responseType: 'json',
      callback
    });
  }
}
