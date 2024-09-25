# HederaPay

HederaPay allows users to integrate Hedera transactions into their WordPress websites and WooCommerce shops.

## Dependencies (OPTIONAL)

-   (OPTIONAL) [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/pro/)
    -   If ACF PRO is installed, the plugin adds an easy to use Gutenberg block (these blocks have the same functionality as the shortcodes).
-   (OPTIONAL) [WooCommerce](https://woocommerce.com/)
    -   If WooCommerce is installed the HederaPay option is added to the Payment options in the WooCommerce check-out.

## Installation

Download the [hederapay.zip](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay.zip) file from the root of this repository. Go to the `WP dashboard` **>** `Plugins`. Click `Add New Plugin` **>** `Upload Plugin` and upload the downloaded zipfile. This will upload and install the plugin, next click `Activate` to activate the plugin.

> Plugin will soon be listed in the build-in WordPress Plugin Store for easier installation.

## Configuration

On the HederaPay settings page you can set your site-specific WalletConnect Project ID\* and the metadata that is shown in the transaction modal.

\* You will need a WalletConnect Project ID. You can get one by going to [WalletConnect](https://cloud.walletconnect.com/) and setting up a new `WalletKit` project.

![Admin Settings](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/admin-settings.png)

## Configuration for WooCommerce shops

On the HederaPay for WooCommerce admin page (`WP Dashboard` **>** `WooCommerce` **>** `Settings` **>** `Payments` **>** `HederaPay for WooCommerce`) you can select the network and the Account ID of the receiver on that network. Optionally, you can also change success and failure messages that will be displayed to the user after the transaction.

![WooCommerce Admin Settings](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/woocommerce-admin.png)

## Shortcodes

### `[hederapay_transaction_button]`

Adds a transaction button for sending transactions on Hedera. It uses [WalletConnect](https://walletconnect.com/) to establish a a secure connection with cryptocurrency wallets.

> The button has a small badge in the top right corner when the active network is `testnet` or `previewnet` to warn the user/developer that the code isn't running on the mainnet.

#### Attributes

| Attribute          | Description                                   | Default value |
| :----------------- | :-------------------------------------------- | :------------ |
| title              | Button text                                   | Pay           |
| amount             | Amount to be send in _currency_ (see details) | null          |
| currency           | Currency the _amount_ is in (see details)     | USD           |
| memo               | Message to send along with the transaction    | null          |
| testnet_account    | Receiver Account ID on the testnet            | null          |
| previewnet_account | Receiver Account ID on the previewnet         | null          |
| mainnet_account    | Receiver Account ID on the mainnet            | null          |

#### Details

##### Currency

The following currencies are supported: `USD` `EUR` `JPY` `GBP` `AUD` `CAD` `CNY` `INR` `BRL` `ZAR` `CHF` `RUB` `NZD` `MXN` `SGD`
The currencies aren't case-sensitive.

##### Amount

Amounts are converted to `HBAR` using the [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/simple-price). Subsequently, the `HBAR` amount is converted to `tinybar` and rounded to an integer value. When no amount is provided an input-field appears in which the user can enter an amount.

> 1 HBAR = 100.000.000 tinybar.

##### Accounts

Always provide a `mainnet_account` **or** a `previewnet_account` **or** a `testnet_account`. The shortcode won't work if you provide multiple IDs. This is a safety measure to avoid mistakes. Perhaps unsurprisingly, the shortcode also won't work when you don't provide any receiver account ID at all.

> Account IDs on Hedera have to start with **_0.0._**

**Examples:**  
`[hederapay_transaction_button amount="5" currency="eur" title="☕︎ Buy us a coffee" testnet_account="0.0.4505361" memo="Coffee donation"]`

![Transaction button](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/transaction-button.png)

`[hederapay_transaction_button currency="usd" title="Donate" testnet_account="0.0.4505361"]`

![Transaction button with input field](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/transaction-button-with-input.png)

#### Gutenberg block

On websites with Gutenberg (WordPress version >= 5.0) and [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/pro/) you can use the _HederaPay Transaction Button_-Gutenberg block instead of the shortcode. The functionality and output are the same as the shortcode.

![Gutenberg block](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/gutenberg-block.png)

### [hederapay_connect_button] _(optional)_

Adds a connect/disconnect button.

Useful when you want to allow the user to connect their wallet without sending a transaction. After connecting the button acts as a disconnect button. It uses [WalletConnect](https://walletconnect.com/) to establish a a secure connection with cryptocurrency wallets.

> The button has a small badge in the top right corner when the active network is `testnet` or `previewnet` to warn the user/developer that the code isn't running on the mainnet.

#### Attributes _(all attributes are optional)_

| Attribute       | Description                                     | Default value     |
| :-------------- | :---------------------------------------------- | :---------------- |
| network         | Type of network: testnet, previewnet or mainnet | testnet           |
| connect_text    | Button text before wallet is paired             | Connect wallet    |
| disconnect_text | Button text after connection is established     | Disconnect wallet |

**Example:**  
`[hederapay_connect_button network="testnet" connect_text="Connect" disconnect_text="Disconnect"]`

![Connect / disconnect button](https://github.com/louweal/hellofuturehackathon/blob/master/hederapay/assets/connect-button.png)

### [hederapay_paired_account] _(optional)_

Displays the Account ID of the paired wallet. It is hidden when no wallet is connected.

## Other Plugins by HashPress Pioneers

-   [Realviews](https://github.com/louweal/hellofuturehackathon/tree/master/realviews)
