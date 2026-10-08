const router = require("express").Router();
const multer = require('multer');
const upload = multer();
const uniqid = require('uniqid');

let dbInstance;

router.setDb = function(db) {
  dbInstance = db;
};

//запрос списка транзакций
router.get("/", upload.none(), function(request, response) {
    const db = dbInstance;
    let transactions = db.get("transactions").filter({ account_id: request.query.account_id }).value();
    response.json({ success: true, data: transactions });
});

//запрос создания/удаления транзакции (POST /transaction)
router.post("/", upload.none(), function(request, response) {
    const db = dbInstance;

    if (request.body.id) {
        let transactions = db.get("transactions");
        let { id } = request.body;
        let removingTransaction = transactions.find({ id });

        if (removingTransaction.value()) {
            transactions.remove({ id }).write();
            response.json({ success: true });
        } else {
            response.json({ success: false });
        }
        return;
    }

    let transactions = db.get("transactions");
    const reg = /^-?\d+(\.\d+)?$/;
    const { type, name, sum, account_id } = request.body;
    let currentUser = db.get("users").find({ id: request.session.id }).value();

    if (!currentUser) {
        response.json({ success: false, error: "Необходима авторизация" });
        return;
    }

    if (!type || !name || !account_id || sum === undefined || sum === null || !reg.test(String(sum))) {
        response.json({ success: false, error: "Недопустимые символы в поле Сумма" });
        return;
    }

    transactions.push({
        id: uniqid(),
        type: String(type).toLowerCase(),
        name,
        sum: Number(sum),
        account_id,
        user_id: currentUser.id,
        created_at: new Date().toISOString()
    }).write();

    response.json({ success: true });
});

module.exports = router;
