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
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelector('select[name="account_id"]');
    if (!select) return;

    Account.list({}, (err, response) => {
      if (err) {
        console.error('Ошибка загрузки счетов:', err);
        return;
      }
      const accounts = response && response.data ? response.data : [];
      select.innerHTML = '';
      accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        select.appendChild(option);
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit({ data }) {
    console.log('CreateTransactionForm.onSubmit called, data:', data);
    data.sum = Number(data.sum);
    Transaction.create(data, (err, response) => {
      console.log('Transaction.create callback - err:', err, 'response:', response);
      if (err) {
        console.error('Ошибка создания транзакции:', err);
        return;
      }
      if (response && response.success) {
        App.update();
        this.element.reset();
        if (this.modal) {
          this.modal.close();
        }
      } else {
        console.error('Ошибка создания транзакции:', response && response.error ? response.error : 'Неизвестная ошибка');
      }
    });
  }
}