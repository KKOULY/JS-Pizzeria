/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Вибір Піци'
    });
};

exports.orderPage = function(req, res) {
    res.render('orderPage', {
        pageTitle: 'Замовлення Піци'
    });
};
exports.paymentPage = function(req, res) {
    res.render('paymentPage', {
        pageTitle: 'Замовлення Піци'
    });
};