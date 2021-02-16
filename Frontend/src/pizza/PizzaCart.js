/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};
var basil = require("basil.js");

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var $totalPrice = $("#total");

$(".clear").click(function(){
    clearCart();
    //Оновлюємо відображення
    updateCart();
});

function findCartElementIndex(pizza, size) {
    let i = undefined;
    Cart.forEach( (p,index) => {
        if(pizza.id === p.pizza.id && size === p.size){
           i = index;
        }
    })
    return i;
}

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    let a = {id:2,kol:"fsdf"};
    //Приклад реалізації, можна робити будь-яким іншим способом
    let cartIndex = findCartElementIndex(pizza,size);
    if(Cart[cartIndex]) Cart[cartIndex].quantity += 1;
    else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    let cartIndex = findCartElementIndex(cart_item.pizza,cart_item.size);
    console.log(cartIndex);
    if(cart_item !== 'undefined') Cart.splice(cartIndex,1);
    //Після видалення оновити відображення
    updateCart();
}

function clearCart() {
    Cart = [];
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    var saved_carts = basil.localStorage.get("cart");
    if(saved_carts) Cart = JSON.parse(saved_carts);
    console.log(Cart);
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    basil.localStorage.set("cart",JSON.stringify(Cart));
    //Очищаємо старі піци в кошику
    $cart.html("");

    let totalSum = 0;
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        totalSum += cart_item.pizza[cart_item.size].price*cart_item.quantity;
        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            if(cart_item.quantity>1) {
                cart_item.quantity -= 1;
                //Оновлюємо відображення
                updateCart();
            }
        });
        $node.find(".close").click(function(){
            console.log("close button clicked")
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }
    Cart.forEach(showOnePizzaInCart);
    $totalPrice.text(totalSum.toString()+"₴");
    $(".order-count").text(Cart.length.toString());

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;