
var API = require('../API');
var basil = require('basil.js');
order_info = {
    name: undefined,
    number: undefined,
    address: undefined,
    pizzas: undefined
}
function orderSendCheck(error, rdata){
    if(error === null){
        LiqPayCheckout.init({
            data:	rdata.data,
            signature:	rdata.signature,
            embedTo:	"#liqpay",
            mode:	"popup"	//	embed	||	popup
        }).on("liqpay.callback",	function(data){
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready",	function(data){
//	ready
        }).on("liqpay.close",	function(data){
//	close
        });
    }
}

function isNotName(t) {
    return (hasNumbers(t) || t.length < 1);

}

function initialiseOrder(){

    initMap();

    $("#inputName").on("keyup",function () {
       validation($(this), isNotName);
    });
    $("#inputNumber").on("keyup",function () {
        validation($(this),isNotPhoneNumber);
    })

    $("#btn-next").click(function () {
        if(allValid()){
            order_info.name = $("#inputName").val();
            order_info.number = $("#inputNumber").val();
            order_info.address = $("#inputAddress").val();
            var saved_carts = basil.localStorage.get("cart");
            if(saved_carts) {
                order_info.pizzas = JSON.parse(saved_carts);
                API.createOrder(order_info, orderSendCheck);
                // var url = API.getURL()+"/payment.html";
                // $(location).attr('href',url);
            }
        }
    })

}

function allValid() {
    var flag = true;
    if( !validation($("#inputName"),isNotName)) flag =  false;
    if( !validation($("#inputNumber"),isNotPhoneNumber)) flag = false;
    if ( !validation($("#inputAddress"),isNotAddress)) flag = false;
    return flag;
}

function hasNumbers(t) {
    var regex = /\d/g;
    return regex.test(t);
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function isNotPhoneNumber(t){
    if(t.length === 13){
        return !isNumeric(t.slice(1));
    }else if(t.length === 10){
        return !isNumeric(t);
    }else return true;
}

function isNotAddress() {
    return $("#address-field").text() === "Невідомо";
}

function validation($field, validFunc){
    let text = $field.val();
    $field.removeClass("is-valid");
    $field.removeClass("is-invalid");
    if(validFunc(text)){
        $field.addClass("is-invalid");
        return false;
    } else {
        $field.addClass("is-valid");
        return true;
    }
}


function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const location = { lat: 50.464379, lng: 30.519131 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ],
    });
    directionsRenderer.setMap(map);
    const geocoder = new google.maps.Geocoder();

    $("#inputAddress").change( () => {
        console.log("Change")
        geocodeAddress(geocoder, $("#inputAddress"));
    });
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon:	"assets/images/map-icon.png"
    });
    const home_marker = new google.maps.Marker({
        position: location,
        map: null,
        icon:	"assets/images/home-icon.png"
    });
    map.addListener("click", (e) => {
        calculateAndDisplayRoute(directionsService, directionsRenderer,e.latLng);
    });

    function calculateAndDisplayRoute(directionsService, directionsRenderer,latLng) {
        directionsService.route(
            {
                origin: marker.position,
                destination: latLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                    directionsRenderer.setOptions({
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: 'white',
                            strokeOpacity: 0.7,
                            strokeWeight: 5,
                        }
                    });
                    var route = response.routes[0].legs[0];
                    $("#order-time-field").text(route.duration.text);
                    $("#address-field").text(route.end_address);
                    $("#inputAddress").val(route.end_address);
                    home_marker.setMap(map);
                    home_marker.setPosition(route.end_location);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
    function geocodeAddress(geocoder, $field) {
        const address = $field.val();
        geocoder.geocode({ address: address }, (results, status) => {
            $field.removeClass("is-valid");
            $field.removeClass("is-invalid");
            if (status === "OK") {
                $field.addClass("is-valid");
                $("#address-field").text(address);
                calculateAndDisplayRoute(directionsService, directionsRenderer,results[0].geometry.location);
            } else {
                $field.addClass("is-invalid");
                $("#address-field").text("Невідомо");
            }
        });
    }

}



exports.initialiseOrder = initialiseOrder;