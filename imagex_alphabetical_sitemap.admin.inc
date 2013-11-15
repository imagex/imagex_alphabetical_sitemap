<?php

/**
 * @file Alphabetical sitemap administration functionality.
 */


/**
 * Alphabetical sitemap administrative configuration form.
 *
 * @ingroup forms
 */
function imagex_alphabetical_sitemap_admin() {

  $form = array();

  $form['imagex_alphabetical_sitemap_path'] = array(
    '#type' => 'textfield',
    '#title' => t('Path to Alphabetical Sitemap'),
    '#description' => t('The internal path for the location of the Alphabetical Sitemap page.'),
    '#default_value' => variable_get('imagex_alphabetical_sitemap_path', 'a-z'),
  );
  $form['imagex_alphabetical_sitemap_path_ahah'] = array(
    '#type' => 'textfield',
    '#title' => t('Asynchronous endpoint path'),
    '#description' => t('The internal path for the asynchronous endpoint for AHAH requests. If you don\'t know what this means, then it\'s best to leave it in its default location.'),
    '#default_value' => variable_get('imagex_alphabetical_sitemap_path_ahah', 'a-z-ahah'),
  );
  $form['imagex_alphabetical_sitemap_listing_view'] = array(
    '#type' => 'textfield',
    '#title' => t('View for Alphabetical Sitemap listing by letter'),
    '#description' => t('Alphabetical Sitemap comes with its own pre-configured view for listing pages by letter. However, if you\'d like to use your own view, you can select it here'),
    '#default_value' => variable_get('imagex_alphabetical_sitemap_listing_view', 'a_z_listings'),
  );
  $form['imagex_alphabetical_sitemap_search_view'] = array(
    '#type' => 'textfield',
    '#title' => t('View for Alphabetical Sitemap search'),
    '#description' => t('Alphabetical Sitemap comes with its own pre-configured view for searching pages. However, if you\'d like to use your own view, you can select it here'),
    '#default_value' => variable_get('imagex_alphabetical_sitemap_search_view', 'a_z_fuzzy_search'),
  );
  $form['imagex_alphabetical_sitemap_titles_by_word'] = array(
    '#type' => 'checkbox',
    '#title' => t('Parse and display titles by word'),
    '#description' => t('In the Alphabetical Sitemap listings by letter, items appear based on the first letter of the title. An item titled "About us" will appear under the letter "A". However, if this option is selected, the items will be parsed by word and will appear under multiple letters. As a result, an item titled "About us" will then appear under the letters "A" and "U".'),
    '#default_value' => variable_get('imagex_alphabetical_sitemap_titles_by_word', 1),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  $form['#submit'][] = 'imagex_alphabetical_sitemap_admin_submit';

  return $form;

}

/**
 * Submit handler for admin settings form.
 *
 * @see imagex_alphabetical_sitemap_admin()
 *
 * @ingroup forms
 */
function imagex_alphabetical_sitemap_admin_submit(&$form, &$form_state) {

  $rebuild = FALSE;

  if ($form_state['values']['imagex_alphabetical_sitemap_path'] != variable_get('imagex_alphabetical_sitemap_path', 'a-z')) {

    $rebuild = TRUE;

  }

  if ($form_state['values']['imagex_alphabetical_sitemap_path_ahah'] != variable_get('imagex_alphabetical_sitemap_path_ahah', 'a-z-ahah')) {

    $rebuild = TRUE;

  }

  variable_set('imagex_alphabetical_sitemap_path', $form_state['values']['imagex_alphabetical_sitemap_path']);
  variable_set('imagex_alphabetical_sitemap_path_ahah', $form_state['values']['imagex_alphabetical_sitemap_path_ahah']);
  variable_set('imagex_alphabetical_sitemap_listing_view', $form_state['values']['imagex_alphabetical_sitemap_listing_view']);
  variable_set('imagex_alphabetical_sitemap_search_view', $form_state['values']['imagex_alphabetical_sitemap_search_view']);
  variable_set('imagex_alphabetical_sitemap_titles_by_word', $form_state['values']['imagex_alphabetical_sitemap_titles_by_word']);

  if ($rebuild) {

    menu_rebuild();

  }

}


