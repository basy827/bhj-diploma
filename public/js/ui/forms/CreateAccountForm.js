/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  constructor(element) {
    console.log('CreateAccountForm constructor called, element:', element);
    super(element);
  }

  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit({ data }) {
    console.log('CreateAccountForm.onSubmit called with data:', data);
    Account.create(data, (err, response) => {
      console.log('Account.create callback:', err, response);
      if (err) {
        console.error('Ошибка создания счёта:', err);
        return;
      }
      if (response && response.success) {
        if (this.modal) {
          this.modal.close();
        }
        App.update();
        this.element.reset();
      } else {
        console.error('Ошибка создания счёта:', response && response.error ? response.error : 'Неизвестная ошибка');
      }
    });
  }
}