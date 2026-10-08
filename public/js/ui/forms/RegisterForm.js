/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit({ data }) {
    User.register(data, (err, response) => {
      if (err || !response || !response.success) {
        return;
      }
      this.element.reset();
      App.setState('user-logged');
      if (this.modal) {
        this.modal.close();
      }
    });
  }
}