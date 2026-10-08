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
    this.clearError();
    User.login(data, (err, response) => {
      if (err || !response || !response.success) {
        this.showError(err ? err.message : response && response.error
          ? response.error
          : 'Не удалось выполнить вход. Попробуйте ещё раз.');
        return;
      }
      this.element.reset();
      App.setState('user-logged');
      if (this.modal) {
        this.modal.close();
      }
    });
  }

  showError(message) {
    let error = this.element.querySelector('.login-error');
    if (!error) {
      error = document.createElement('div');
      error.className = 'alert alert-danger login-error';
      error.setAttribute('role', 'alert');
      this.element.prepend(error);
    }
    error.textContent = message;
  }

  clearError() {
    const error = this.element.querySelector('.login-error');
    if (error) {
      error.remove();
    }
  }
}
