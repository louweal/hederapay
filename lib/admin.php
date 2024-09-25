<?php

/**
 * Template:			admin.php
 * Description:			Custom admin settings
 */

add_action('admin_menu', function () {
    add_menu_page('HederaPay', 'HederaPay', 'manage_options', 'hederapay', 'hederapay_settings', 'dashicons-money-alt');
});

function hederapay_settings()
{
?>
    <h1>HederaPay</h1>
    <form method="post" action="options.php">
        <?php
        settings_fields('hederapay_settings_group');
        do_settings_sections('hederapay-settings');
        submit_button();
        ?>
    </form>
<?php
}

add_action('admin_init', 'hederapay_settings_init');
function hederapay_settings_init()
{
    register_setting('hederapay_settings_group', 'hederapay_settings');

    add_settings_section(
        'hederapay_settings_section',
        '',
        'hederapay_settings_section_callback',
        'hederapay-settings'
    );

    add_settings_field(
        'project-id',
        'WalletConnect Project ID',
        'hederapay_project_id_field_callback',
        'hederapay-settings',
        'hederapay_settings_section'
    );

    add_settings_field(
        'name',
        'Name',
        'hederapay_name_field_callback',
        'hederapay-settings',
        'hederapay_settings_section'
    );
    add_settings_field(
        'description',
        'Description',
        'hederapay_description_field_callback',
        'hederapay-settings',
        'hederapay_settings_section'
    );
    add_settings_field(
        'icon',
        'Icon URL',
        'hederapay_icon_field_callback',
        'hederapay-settings',
        'hederapay_settings_section'
    );
    add_settings_field(
        'URL',
        'URL',
        'hederapay_url_field_callback',
        'hederapay-settings',
        'hederapay_settings_section'
    );
}

function hederapay_settings_section_callback()
{
    // echo "This metadata is shown in the transaction modal.";
}

function hederapay_project_id_field_callback()
{
    $settings = get_option('hederapay_settings');
    $project_id = isset($settings['project_id']) ? esc_html($settings['project_id']) : '';
?>
    <input type="text" name="hederapay_settings[project_id]" value="<?php echo $project_id; ?>">
<?php
}

function hederapay_name_field_callback()
{
    $settings = get_option('hederapay_settings');
    $name = isset($settings['name']) ? esc_html($settings['name']) : get_bloginfo('name');
?>
    <input type="text" name="hederapay_settings[name]" value="<?php echo $name; ?>">
<?php
}

function hederapay_description_field_callback()
{
    $settings = get_option('hederapay_settings');
    $description = isset($settings['description']) ? esc_html($settings['description']) : get_bloginfo('description');
?>
    <input type="text" name="hederapay_settings[description]" value="<?php echo $description; ?>">
<?php
}

function hederapay_icon_field_callback()
{
    $settings = get_option('hederapay_settings');
    $icon = isset($settings['icon']) ? esc_html($settings['icon']) : get_site_icon_url();
?>
    <input type="text" name="hederapay_settings[icon]" value="<?php echo $icon; ?>">
<?php
}

function hederapay_url_field_callback()
{
    $settings = get_option('hederapay_settings');
    $url = isset($settings['url']) ? esc_html($settings['url']) : home_url();
?>
    <input type="text" name="hederapay_settings[url]" value="<?php echo $url; ?>">
<?php
}

function custom_admin_inline_styles()
{
?>
    <style>
        input[type="number"],
        input[type="text"],
        input[type="email"],
        input[type="url"],
        input[type="password"],
        textarea {
            width: min(70vw, 700px);
        }
    </style>
<?php
}
add_action('admin_head', 'custom_admin_inline_styles');
