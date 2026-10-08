/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit({ data }) {
    User.login(data, (err, response) => {
      if (err) {
        console.error('Ошибка входа:', err);
        const errorEl = this.element.querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = err.message || 'Не удалось войти. Попробуйте позже.';
          errorEl.style.display = 'block';
        }
        return;
      }

      App.setState('user-logged');
      this.element.reset();

      if (this.modal) {
        this.modal.close();
      }
    });
  }
}