/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const authLinks = document.querySelectorAll('[data-action]');

    authLinks.forEach(btn => {
      const action = btn.getAttribute('data-action');

      btn.addEventListener('click', () => {
        switch (action) {
          case 'login':
            const loginModal = App.getModal('login');
            if (loginModal) loginModal.show();
            break;

          case 'register':
            const regModal = App.getModal('register');
            if (regModal) regModal.show();
            break;

          case 'logout':
            User.logout((err, response) => {
              if (!err) {
                App.setState('init');
              }
            });
            break;

          default:
            console.warn(`Unknown action: ${action}`);
        }
      });
    });
  }
}