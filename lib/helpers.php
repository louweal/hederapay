<?php

/**
 * Template:			helpers.php
 * Description:			Custom functions used by the plugin
 */

function add_meta_to_post($post_id, $key, $value)
{
    $current_meta_value = get_post_meta($post_id, $key, true);

    if (empty($current_meta_value) || !is_array($current_meta_value)) {
        $current_meta_value = array();
    } else {
        // check it is already in 
        foreach ($current_meta_value as $v) {
            if ($v == $value) {
                return; // don't add it again
            }
        }
    }

    $current_meta_value[] = $value;
    update_post_meta($post_id, $key, $current_meta_value);
}
