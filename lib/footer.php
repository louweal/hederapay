<?php

function add_hederapay_settings_to_footer()
{
    $settings = get_option('hederapay_settings');

    $project_id = isset($settings['project_id']) ? esc_html($settings['project_id']) : '';

    $name = isset($settings['name']) ? esc_html($settings['name']) : get_bloginfo('name');
    $description = isset($settings['description']) ? esc_html($settings['description']) : get_bloginfo('description');
    $icon = isset($settings['icon']) ? esc_html($settings['icon']) : get_site_icon_url();
    $url = isset($settings['url']) ? esc_html($settings['url']) : home_url();

    $data = array(
        "projectId" => $project_id,
        "name" => $name,
        "description" => $description,
        "icon" => $icon,
        "url" => $url
    );

    $jsonData = json_encode($data);     // Encode to JSON
    $encodedData = base64_encode($jsonData);     // Encode the JSON string using Base64
?>
    <div id="hederapay-app-metadata" style="display: none;" data-attributes="<?php echo $encodedData; ?>"></div>
<?php
}
add_action('wp_footer', 'add_hederapay_settings_to_footer');
