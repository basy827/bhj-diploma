/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelector('select[name="account_id"]');
    if (!select) return;

    Account.list({}, (err, response) => {
      if (err || !response || !response.success) {
        return;
      }
      const accounts = response.data || [];
      select.innerHTML = accounts.map(
        (item) => `<option value="${item.id}">${item.name}</option>`
      ).join('');
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit({ data }) {
    Transaction.create(data, (err, response) => {
      if (err || !response || !response.success) {
        return;
      }
      this.element.reset();
      if (this.modal) {
        this.modal.close();
      }
      App.update();
    });
  }
}
