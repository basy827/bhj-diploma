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
      if (err) {
        console.error('Ошибка регистрации:', err);

        const errorEl = this.element.querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = err.message || 'Не удалось зарегистрироваться. Попробуйте позже.';
          errorEl.style.display = 'block';
        }
        return;
      }

      App.setState('user-logged');

      if (this.modal) {
        this.modal.close();
      }
    });
  }
}