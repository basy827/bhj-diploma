const router = require("express").Router();
const uniqid = require('uniqid');

let dbInstance;

router.setDb = function(db) {
  dbInstance = db;
};

//Запрос регистрации пользователя
router.post("/register", function(request, response) {
    const db = dbInstance;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        let error = [];
        if (!name) error.push('Поле Имя обязательно для заполнения.');
        if (!email) error.push('Поле E-Mail адрес для заполнения.');
        if (!password) error.push('Поле Пароль обязательно для заполнения.');
        response.json({ success: false, error: error.join(' ') });
        return;
    }

    let user = db.get("users").find({email}).value();
    if (!user) {
        user = { name, email, password, id: uniqid() };
        db.get("users").push(user).write();
        request.session.id = user.id;
        response.json({ success: true, user });
        return;
    }

    response.json({ success: false, error: `E-Mail адрес ${email} уже существует.` });
});

//запрос авторизации пользователя
router.post("/login", function(request, response) {
    const db = dbInstance;
    const { email, password } = request.body;
    const foundedUser = db.get("users").find({ email, password }).value();

    if (foundedUser) {
        request.session.id = foundedUser.id;
        response.json({ success: true, user: foundedUser });
        return;
    }

    response.json({ success: false, error: "Неверный e-mail или пароль." });
});

//запрос разлогина пользователя
router.post("/logout", function(request, response) {
    if (request.session.id) {
        delete request.session.id;
        response.json({success: true});
    } else {
        //отправляется ответ успешности
        response.json({success: false, error: 'Пользователь не авторизован'});
    }
})

function getCurrentUserPayload(db, sessionId) {
    const userValue = db.get("users").find({id: sessionId}).value();
    if (!userValue) {
        return null;
    }
    // Копия без пароля — нельзя мутировать объект из lowdb
    const { password, ...user } = userValue;
    return user;
}

//запрос получения текущего пользователя
router.get("/current", function(request, response) {
    const db = dbInstance;
    const user = getCurrentUserPayload(db, request.session.id);
    if (user) {
        response.json({success: true, user});
    } else {
        response.json({success: false, user: null, error: 'Пользователь не авторизован'});
    }
})

//алиас для /current
router.get("/me", function(request, response) {
    const db = dbInstance;
    const user = getCurrentUserPayload(db, request.session.id);
    if (user) {
        response.json({success: true, user});
    } else {
        response.json({success: false, user: null, error: 'Пользователь не авторизован'});
    }
})


module.exports = router;
