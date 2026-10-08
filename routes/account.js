const router = require("express").Router();
const multer  = require('multer');
const upload = multer();
const uniqid = require('uniqid');

let dbInstance;

router.setDb = function(db) {
  dbInstance = db;
};

//запрос создания/удаления счета (POST /account)
router.post("/", upload.none(), function(request, response) {
    const db = dbInstance;

    // Если в body есть id — это удаление
    if (request.body.id) {
        let accounts = db.get("accounts");
        let transactions = db.get("transactions");
        let removingAccount = accounts.find({id: request.body.id}).value();
        if(removingAccount){
            accounts.remove({id: request.body.id}).write();
            transactions.remove({account_id: request.body.id}).write();
            response.json({success: true});
        }else{
            response.json({success: false});
        }
        return;
    }

    // Иначе — создание счета
    const {name} = request.body;
    let user = db.get("users").find({id: request.session.id});
    let userValue = user.value();
    if(!userValue){
        response.json({success: false, error: "Пользователь не авторизован"});
        return;
    }

    const existingAccount = db.get("accounts").filter({user_id: request.session.id}).find({name}).value();
    if(existingAccount){
        response.json({success: false, error: "Счёт с таким именем уже существует"});
        return;
    }

    let creatingAccount = {name, user_id:userValue.id, id: uniqid()};
    db.get("accounts").push(creatingAccount).write();
    response.json({success: true, account: creatingAccount});
});

//запрос получения списка счетов
router.get("/:id?", upload.none(), function(request, response) {
    const db = dbInstance;
    let { id } = request.session; // получение id пользователя из запроса

    let user = db.get("users").find({id});
    let userValue = user.value();

    if(!userValue){
      response.json({success: false, error:"Пользователь не авторизован"});
      return;
    }

    let accountId = request.params.id;

    if(accountId){
        let currentAccount = db.get("accounts").find({id: accountId}).value();
        if(!currentAccount){
          response.json({success: false, error: `Счёт c идентификатором ${accountId} не найден`});
          return;
        }
        let currentAccountTransactions = db.get("transactions").filter({account_id: currentAccount.id}).value();
        currentAccount.sum = currentAccountTransactions.reduce((sum, a) => a.type === "expense" ? sum - a.sum : sum + a.sum, 0);
        response.json({success: true, data: currentAccount});
    } else {
        let accounts = db.get("accounts").filter({user_id:userValue.id}).value();
        for(let i = 0; i < accounts.length; i++){
            let transactions = db.get("transactions").filter({account_id: accounts[i].id}).value();
            accounts[i].sum = transactions.reduce((sum, a) => a.type === "expense" ? sum - a.sum : sum + a.sum, 0);
        }
        response.json({success: true, data: accounts});
    }
});

module.exports = router;
