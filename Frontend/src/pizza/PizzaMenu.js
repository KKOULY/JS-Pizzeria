/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
var Pizza_List = [];


//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function initPizzaList(error, data){
    if (error === null){
        Pizza_List = data;
        showPizzaList(Pizza_List);
    }
}

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
    $(".pizza-count").text(list.length.toString());
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        if(filter(pizza)) pizza_shown.push(pizza);
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    API.getPizzaList(initPizzaList);
    //Показуємо усі піци
    showPizzaList(Pizza_List);

    $("#all-filter").click(function () {
       showPizzaList(Pizza_List);
    });
    $("#meat-filter").click(function () {
        filterPizza(function (pizza) {
            return !pizza.type.localeCompare('М’ясна піца');
        });
    });
    $("#pineapple-filter").click(function () {
        filterPizza(function (pizza) {
            return (typeof pizza.content.pineapple !== 'undefined');
        });
    });
    $("#mushrooms-filter").click(function () {
        filterPizza(function (pizza) {
            return (typeof pizza.content.mushroom !== 'undefined');
        });
    });
    $("#seafood-prod-filter").click(function () {
        filterPizza(function (pizza) {
            return (typeof pizza.content.ocean !== 'undefined');
        });
    });
    $("#vega-filter").click(function () {
        filterPizza(function (pizza) {
            return !pizza.type.localeCompare('Вега піца');
        });
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;