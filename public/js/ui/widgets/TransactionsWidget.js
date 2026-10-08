/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент виджета не найден');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const incomeBtn = e.target.closest('.create-income-button');
      if (incomeBtn) {
        const modal = App.getModal('newIncome');
        if (modal) {
          modal.show();
        }
        return;
      }

      const expenseBtn = e.target.closest('.create-expense-button');
      if (expenseBtn) {
        const modal = App.getModal('newExpense');
        if (modal) {
          modal.show();
        }
      }
    });
  }
}
