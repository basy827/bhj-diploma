const router = require("express").Router();
const multer  = require('multer');
const upload = multer();
const uniqid = require('uniqid');

let dbInstance;

router.setDb = function(db) {
  dbInstance = db;
};

//запрос списка транзакций
router.get("/", upload.none(), function(request, response) {
    const db = dbInstance;// получение БД
    //получение значения списка транзакций, для указанного счёта
    let transactions = db.get("transactions").filter({account_id: request.query.account_id}).value();
    //отправка ответа со списком транзакций
    response.json({ success: true, data: transactions });
});

//запрос создания/удаления транзакции (POST /transaction)
router.post("/", upload.none(), function(request, response) {
    const db = dbInstance;

    // Если в body есть id — это удаление
    if (request.body.id) {
        let transactions = db.get("transactions");
        let { id } = request.body;
        let removingTransaction = transactions.find({id});
        if(removingTransaction.value()){
            transactions.remove({id}).write();
            response.json({ success: true });
        }else{
            response.json({ success: false });
        }
        return;
    }

    // Иначе — создание транзакции
    let transactions = db.get("transactions");
    const reg =  /^\-?\d+(\.?\d+)?$/;
    const { type, name, sum, account_id } = request.body;
    let currentUser = db.get("users").find({id: request.session.id}).value();
    if(!currentUser){
        response.json({ success: false, error:"Необходима авторизация" });
        return;
    }
    else{
        if (reg.test(sum)) {
            let currentUserId = currentUser.id;
            transactions.push({
                id: uniqid(),
                type: type.toLowerCase(),
                name,
                sum: +sum,
                account_id,
                user_id: currentUserId,
                created_at: new Date().toISOString()
            }).write();
            response.json({success: true});
        } else {
            response.json({ success: false, error:"Недопустимые символы в поле Сумма" });
        }
    }
});

module.exports = router;
