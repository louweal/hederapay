<?php

if (!defined('ABSPATH')) {
    exit;
}

class WC_Gateway_Hederapay extends WC_Payment_Gateway
{
    public $wallet;

    public function init_form_fields()
    {
        $this->form_fields = array(
            'enabled' => array(
                'title' => 'Enable/Disable',
                'type' => 'checkbox',
                'label' => 'Enable Hedera Payment',
                'default' => 'yes'
            ),
            'title' => array(
                'title' => 'Title',
                'type' => 'text',
                'description' => 'This is the title which the user sees during checkout.',
                'default' => 'Pay with Hedera',
            ),
            'network' => array(
                'title'       => __('Network', 'woocommerce'),
                'type'        => 'select',
                // 'description' => __('This is a custom select field for your payment gateway.', 'woocommerce'),
                'default'     => 'testnet',
                // 'desc_tip'    => true,
                'options'     => array(
                    'testnet' => __('Testnet', 'woocommerce'),
                    'previewnet' => __('Previewnet', 'woocommerce'),
                    'mainnet' => __('Mainnet', 'woocommerce')
                )
            ),
            'testnet_account' => array(
                'title' => 'Testnet account',
                'type' => 'text',
                'description' => 'Required when using testnet',
            ),
            'previewnet_account' => array(
                'title' => 'Previewnet account',
                'type' => 'text',
                'description' => 'Required when using previewnet',
            ),
            'mainnet_account' => array(
                'title' => 'Mainnet account',
                'type' => 'text',
                'description' => 'Required when using mainnet',
            ),
            'success_message' => array(
                'title' => 'Successful transaction message',
                'type' => 'text',
                'default' => 'Payment received. Thank you for your order!',

            ),
        );
    }

    public function __construct()
    {
        $this->id = 'hederapay-for-woocommerce';
        $this->icon = ''; // URL of the icon that will be displayed on the checkout page
        $this->has_fields = true;
        $this->method_title = 'HederaPay for WooCommerce';
        $this->method_description = 'Integrates Hedera transactions';

        // Load the settings
        $this->init_form_fields();
        $this->init_settings();

        // Define user set variables
        $this->title = $this->get_option('title');
        $this->network = $this->get_option('network');
        $this->testnet_account = $this->get_option('testnet_account');
        $this->previewnet_account = $this->get_option('previewnet_account');
        $this->mainnet_account = $this->get_option('mainnet_account');
        $this->success_message = $this->get_option('success_message');

        // Actions
        add_action('woocommerce_receipt_' . $this->id, array($this, 'receipt_page'));
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));

        // Payment listener/API hook
        add_action('woocommerce_api_wc_gateway_' . $this->id, array($this, 'check_response'));
    }



    public function admin_options()
    {
        echo '<h2>' . esc_html($this->get_method_title()) . '</h2>';
        // echo wp_kses_post(wpautop($this->get_method_description()));
        echo '<table class="form-table">';
        $this->generate_settings_html();
        echo '</table>';
    }

    public function payment_fields()
    {
        // if (isset($this->wallet) && !empty($this->wallet)) {
        echo "Pay with your Hedera wallet.";
        // }
    }


    public function validate_fields()
    {
        // Validate payment fields here
        return true;
    }

    public function process_payment($order_id)
    {
        $order = wc_get_order($order_id);
        // Mark as pending payment (allowing the customer to pay).
        $order->update_status('pending', __('Awaiting HBAR payment', 'woocommerce'));

        // Return thank you page redirect.
        return array(
            'result'   => 'success',
            'redirect' => $order->get_checkout_payment_url(true),
            // 'redirect' => $this->get_return_url($order),
        );
    }

    public function receipt_page($order_id)
    {
        $order = wc_get_order($order_id);

        if ($order) {
            $order_total = $order->get_total();
            // $first_name = $order->get_billing_first_name(); // Get the customer's first name
            // $last_name = $order->get_billing_last_name();   // Get the customer's last name
            // $full_name = $first_name . ' ' . $last_name;
            // echo $full_name;

            $currency = get_woocommerce_currency();
            $currency_symbol = get_woocommerce_currency_symbol();
            $account_attribute = $this->getAccountAttribute();

            $transaction_id = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : null;

            if (!$transaction_id) {
                echo do_shortcode('[hederapay_transaction_button network="' . $this->network . '" title="Pay now - ' . $currency_symbol . $order_total . '" ' . $account_attribute . ' currency="' . $currency . '" amount="' . $order_total . '" store="true" memo="Order at ' . get_bloginfo('name') . '"]');
            } else {
                // Mark the order as completed if payment is successful
                $order->update_status('completed', __('Payment received, order completed.', 'woocommerce'));

                // Optionally, you might want to reduce stock levels
                wc_reduce_stock_levels($order_id);

                // Empty the cart after successful payment
                WC()->cart->empty_cart();

                // Display success message
                echo "<p>" . $this->success_message . "</p>";

                // add meta info to products
                foreach ($order->get_items() as $item_id => $item) {
                    $product_id = $item->get_product_id();
                    add_meta_to_post($product_id, '_transaction_ids', $transaction_id);
                }
            }
        } else {
            var_dump("Order not found.");
        }
    }



    public function check_response()
    {
        // Handle the payment response
        echo "Handle response";
    }

    function getAccountAttribute()
    {
        if ($this->network == "testnet" && isset($this->testnet_account) && !empty($this->testnet_account)) {
            return 'testnet_account="' . $this->testnet_account . '"';
        }
        if ($this->network == "previewnet" && isset($this->previewnet_account) && !empty($this->previewnet_account)) {
            return 'previewnet_account="' . $this->previewnet_account . '"';
        }
        if ($this->network == "mainnet" && isset($this->mainnet_account) && !empty($this->mainnet_account)) {
            return 'mainnet_account="' . $this->mainnet_account . '"';
        }
        return '';
    }
}
