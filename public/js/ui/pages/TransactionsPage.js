/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент страницы не найден');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    const account_id = this.element.getAttribute('data-account-id');
    console.log('TransactionsPage.update(), account_id:', account_id);
    if (account_id) {
      this.render({ account_id });
    } else {
      Account.list({}, (err, response) => {
        console.log('TransactionsPage.update Account.list callback - err:', err, 'response:', response);
        if (!err && response && response.data && response.data.length > 0) {
          this.render({ account_id: response.data[0].id });
        }
      });
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-action="remove-transaction"]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-item-id');
        this.removeTransaction(id);
        return;
      }

      const removeAccountBtn = e.target.closest('.remove-account');
      if (removeAccountBtn) {
        this.removeAccount();
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!confirm('Вы действительно хотите удалить счёт?')) {
      return;
    }
    const account_id = this.element.getAttribute('data-account-id');
    if (!account_id) return;

    Account.remove({ id: account_id }, (err, response) => {
      if (err) {
        console.error('Ошибка удаления счёта:', err);
        return;
      }
      this.clear();
      App.updateWidgets();
      App.updateForms();
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (!confirm('Вы действительно хотите удалить транзакцию?')) {
      return;
    }
    Transaction.remove({ id }, (err, response) => {
      if (err) {
        console.error('Ошибка удаления транзакции:', err);
        return;
      }
      App.update();
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    const { account_id } = options;
    if (!account_id) return;

    this.element.setAttribute('data-account-id', account_id);

    Account.get(account_id, (err, response) => {
      if (err) {
        console.error('Ошибка получения счёта:', err);
        return;
      }
      const account = response && response.data ? response.data : null;
      if (account) {
        this.renderTitle(account.name, account.sum);
      }
    });

    Transaction.list({ account_id }, (err, response) => {
      if (err) {
        console.error('Ошибка получения транзакций:', err);
        return;
      }
      const data = response && response.data ? response.data : [];
      this.renderTransactions(data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.element.removeAttribute('data-account-id');
    this.renderTitle('Название счёта', 0);
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * и баланс в .content-description
   * */
  renderTitle(name, sum) {
    const titleEl = this.element.querySelector('.content-title');
    const descEl = this.element.querySelector('.content-description');
    if (titleEl) {
      titleEl.textContent = name;
    }
    if (descEl) {
      const sumFormatted = (sum != null ? sum : 0).toLocaleString('ru-RU', { minimumFractionDigits: 0 });
      descEl.textContent = sumFormatted + ' \u20BD';
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const d = new Date(date);
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const iconClass = item.type === 'income' ? 'fa-thumbs-o-up' : 'fa-thumbs-o-down';
    const typeClass = item.type === 'income' ? 'transaction_income' : 'transaction_expense';
    const sign = item.type === 'income' ? '+' : '-';
    const amount = Math.abs(item.sum).toLocaleString('ru-RU');

    return `
      <div class="transaction ${typeClass}" data-item-id="${item.id}">
        <div class="transaction-icon">
          <span class="fa ${iconClass}"></span>
        </div>
        <div class="transaction-info">
          <span class="transaction-title">${item.name}</span>
          <div class="time">${this.formatDate(item.created_at)}</div>
        </div>
        <div class="sum">${sign}${amount}</div>
        <div class="remove-button" data-action="remove-transaction" data-item-id="${item.id}">
          <span class="fa fa-trash"></span>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector('.content');
    if (!content) return;
    content.innerHTML = '';
    data.forEach(item => {
      const transactionDiv = document.createElement('div');
      transactionDiv.innerHTML = this.getTransactionHTML(item);
      const transactionEl = transactionDiv.firstElementChild;
      content.appendChild(transactionEl);
    });
  }
}
