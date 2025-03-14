<?php

add_action( 'wp_enqueue_scripts', 'checkout_extend_enqueue_styles' );

function checkout_extend_enqueue_styles() {
	wp_enqueue_style( 
		'checkout-extend-style', 
		get_stylesheet_uri()
	);
}

add_action('woocommerce_cart_calculate_fees', 'add_shipping_fee_with_tax');

function add_shipping_fee_with_tax() {
	
    $fee_amount = WC()->session->get('custom_shipping_fee');
    
    if (!$fee_amount || $fee_amount <= 0) {
        return;
    }

    WC()->cart->add_fee(__('Shipping Fee', 'checkout-extend'), $fee_amount);
}

add_action('wp_ajax_checkout_after_customer_save', 'calculate_ship_fee');

function get_distance_ors($origin, $destination) {
	$api_key = defined('OPEN_ROUTE_API_KEY') ? OPEN_ROUTE_API_KEY : null;

	if (!$api_key) {
		throw new Exception("Open Route API Key is missing!");
	}

    $url = "https://api.openrouteservice.org/v2/directions/driving-car";

    $body = json_encode([
        'coordinates' => [$origin, $destination], // [longitude, latitude]
        'instructions' => false
    ]);

    $response = wp_remote_post($url, [
        'method'    => 'POST',
        'headers'   => [
            'Content-Type'  => 'application/json',
            'Authorization' => $api_key
        ],
        'body'      => $body,
        'timeout'   => 15,
    ]);

    if (is_wp_error($response)) {
        return null;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (!isset($data['routes'][0]['summary']['distance'])) {
        return null;
    }
	
    $distance_km = $data['routes'][0]['summary']['distance'] / 1000;
    return round($distance_km * 0.621371, 1); 
}

function estimate_ship_fee($miles) {
    if ($miles > 8) return 12.50;
    if ($miles > 7) return 11.50;
    if ($miles > 6) return 10.50;
    if ($miles > 5) return 9.50;
    if ($miles > 4) return 8.20;
    if ($miles > 3) return 7.20;
    if ($miles > 2.5) return 6.00;
	if($miles > 1.5) return 5.50;
    return 0;
}

function calculate_ship_fee() {
	$origin_latitude = 51.59773;
	$origin_longitude = -0.09055;

    $dest_latitude = $_POST['latitude'];
	$dest_longitude = $_POST['longitude'];

	$distance_miles = get_distance_ors([$origin_longitude, $origin_latitude], [$dest_longitude, $dest_latitude]);
	$ship_fee = estimate_ship_fee($distance_miles);

	WC()->session->set('custom_shipping_fee', $ship_fee);
	WC()->cart->calculate_fees();
	WC()->cart->calculate_totals();

    $response = array('success' => true, 'message' => 'Shipping Updated', 'fee' => $ship_fee);
    wp_send_json($response);
    exit();
}