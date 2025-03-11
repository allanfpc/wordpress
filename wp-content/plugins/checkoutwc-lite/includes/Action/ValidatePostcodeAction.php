<?php

namespace Objectiv\Plugins\Checkout\Action;

/**
 * @link checkoutwc.com
 * @since 5.4.0
 * @package Objectiv\Plugins\Checkout\Action
 */
class ValidatePostcodeAction extends CFWAction {
	public function __construct() {
		parent::__construct( 'cfw_validate_postcode' );
	}

	public function action() {
		if ( empty( $_POST['postcode'] ) || empty( $_POST['country'] ) ) {
			$this->out(
				array(
					'message' => 'Invalid postcode validation request. Must include postcode and country.',
				),
				202 // I was a teapot, but now I'm just a noncommittal response
			);
		}
        
        
        
		$postcode = sanitize_text_field( $_POST['postcode'] );

		$country  = sanitize_text_field( $_POST['country'] );

		$valid = \WC_Validation::is_postcode( trim( $postcode ), $country );

        echo 'first: ' . $_POST['postcode'] . 'san: ' .  $postcode . "valid" . $valid . 'replace: ' . str_replace(' ', '', $postcode) ;
		

		// Check if the postal code has at least 5 characters (UK postcodes are generally 5 characters minimum)
        if ( strlen($postcode) >= 5 ) {
            // Fetch a list of possible matching UK postcodes based on the input
            $matching_postcodes = $this->get_matching_postcodes(str_replace(' ', '', $postcode));

            print_r($matching_postcodes, true);

            // Send the response with the list of possible postcodes or validation message
            if ( !empty( $matching_postcodes ) ) {
                $this->out(
                    array(
                        'message' => '',
                        'matching_postcodes' => $matching_postcodes, // return the matching postcodes
                    ),
                    200 // OK response
                );
            } else {
                $this->out(
                    array(
                        'message' => 'No matching postcodes found. Please enter a valid postcode.',
                    ),
                    400 // Bad request
                );
            }
        } else {
            // Proceed with the standard postcode validation
            $this->out(
                array(
                    'message' => $valid ? '' : __( 'Please enter a valid %s.', 'checkout-wc' ),
                ),
                $valid ? 200 : 400
            );
        }
	}

	/**
     * Fetch matching UK postcodes from the Postcodes.io API
     *
     * @param string $postcode The entered postcode
     * @return array List of matching postcodes
     */
    private function get_matching_postcodes($postcode) {
        // URL for Postcodes.io API
        $api_url = 'https://api.postcodes.io/postcodes/' . urlencode($postcode) . '/autocomplete?limit=25';
        
        // Make the API request
        $response = wp_remote_get($api_url);
		
        if ( is_wp_error( $response ) ) {
            return []; // Return empty array if there's an error
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! isset( $data['result'] ) || empty( $data['result'] ) ) {
            return []; // No matching results found
        }

        // Process and return the matching postcodes
        $matching_postcodes = [];
        foreach ( $data['result'] as $result ) {
            $matching_postcodes[] = $result;
        }

        return $matching_postcodes;
    }
}
