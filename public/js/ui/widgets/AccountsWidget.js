/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент виджета не найден');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const createBtn = e.target.closest('.create-account');
      if (createBtn) {
        const modal = App.getModal('createAccount');
        if (modal) modal.show();
        return;
      }

      const accountEl = e.target.closest('.account');
      if (accountEl) {
        this.onSelectAccount(accountEl);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItems()
   * */
  update() {
    if (!User.current()) return;

    Account.list({}, (err, response) => {
      if (err) {
        console.error('Ошибка загрузки счетов:', err);
        return;
      }
      const data = response && response.data ? response.data : [];
      this.clear();
      this.renderItems(data);
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccount = this.element.querySelector('.account.active');
    if (activeAccount) {
      activeAccount.classList.remove('active');
    }
    element.classList.add('active');
    const accountId = element.getAttribute('data-item-id');
    App.showPage('transactions', { account_id: accountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const sum = item.sum != null ? item.sum : 0;
    const sumFormatted = sum.toLocaleString('ru-RU', { minimumFractionDigits: 0 });
    return `
      <li class="account" data-item-id="${item.id}">
        <a href="#">
          <span>${item.name}</span>
          <span class="account-sum">${sumFormatted} &#8381;</span>
        </a>
      </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItems(data) {
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'account';
      li.setAttribute('data-item-id', item.id);

      const html = this.getAccountHTML(item);
      li.innerHTML = html;

      this.element.appendChild(li);
    });
  }
}
