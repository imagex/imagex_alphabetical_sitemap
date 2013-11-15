<?php
/**
 * @file
 * alpha_sitemap.features.inc
 */

/**
 * Implements hook_views_api().
 */
function imagex_alphabetical_sitemap_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_default_search_api_index().
 */
function imagex_alphabetical_sitemap_default_search_api_index() {
  $items = array();
  $items['default_fuzzysearch_index'] = entity_import('search_api_index', '{
    "name" : "Default fuzzysearch index",
    "machine_name" : "default_fuzzysearch_index",
    "description" : "A default index with basic settings automatically created by fuzzysearch.",
    "server" : "default_fuzzysearch_server",
    "item_type" : "node",
    "options" : {
      "cron_limit" : "50",
      "fields" : {
        "title" : { "type" : "text", "boost" : "5.0" },
        "url" : { "type" : "text" },
        "field_tags" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "taxonomy_term" },
        "search_api_language" : { "type" : "string" },
        "search_api_viewed" : { "type" : "text" }
      },
      "data_alter_callbacks" : {
        "search_api_alter_node_access" : { "status" : 0, "weight" : "-50", "settings" : [] },
        "search_api_alter_node_status" : { "status" : 0, "weight" : "-49", "settings" : [] },
        "search_api_alter_add_hierarchy" : { "status" : 0, "weight" : "-48", "settings" : { "fields" : [] } },
        "search_api_alter_bundle_filter" : {
          "status" : 1,
          "weight" : "-47",
          "settings" : {
            "default" : "0",
            "bundles" : {
              "page" : "page",
              "department" : "department",
              "external_link" : "external_link",
              "program" : "program"
            }
          }
        },
        "search_api_alter_add_viewed_entity" : { "status" : 1, "weight" : "-46", "settings" : { "mode" : "full" } },
        "search_api_alter_add_url" : { "status" : 0, "weight" : "-45", "settings" : [] },
        "search_api_alter_add_aggregation" : { "status" : 0, "weight" : "-44", "settings" : [] }
      },
      "processors" : {
        "search_api_case_ignore" : {
          "status" : 1,
          "weight" : "-50",
          "settings" : { "fields" : { "title" : true, "url" : true, "search_api_viewed" : true } }
        },
        "search_api_html_filter" : {
          "status" : 1,
          "weight" : "-49",
          "settings" : {
            "fields" : { "title" : true, "url" : true, "search_api_viewed" : true },
            "title" : 0,
            "alt" : 1,
            "tags" : "h1 = 5\\r\\n          h2 = 3\\r\\n          h3 = 2\\r\\n          strong = 2\\r\\n          b = 2\\r\\n          em = 1.5\\r\\n          u = 1.5"
          }
        },
        "search_api_tokenizer" : {
          "status" : 1,
          "weight" : "-48",
          "settings" : {
            "fields" : { "title" : true, "url" : true, "search_api_viewed" : true },
            "spaces" : "[^\\\\p{L}\\\\p{N}]",
            "ignorable" : "[-]"
          }
        },
        "fuzzysearch_search" : {
          "status" : 1,
          "weight" : "-47",
          "settings" : {
            "ngram_length" : "3",
            "missing_letters" : "5",
            "extra_letters" : "5",
            "completeness" : "40",
            "sort_score" : 0
          }
        },
        "fuzzysearch_excerpt" : {
          "status" : 1,
          "weight" : "-46",
          "settings" : {
            "debug_score" : 0,
            "excerpt_length" : "200",
            "max_result_length" : "400",
            "spelling" : "30"
          }
        },
        "search_api_stopwords" : {
          "status" : 0,
          "weight" : "30",
          "settings" : {
            "fields" : { "title" : true, "url" : true, "search_api_viewed" : true },
            "file" : "",
            "stopwords" : "but\\r\\ndid\\r\\nthe this that those\\r\\netc"
          }
        }
      }
    },
    "enabled" : "1",
    "read_only" : "0",
    "rdf_mapping" : []
  }');
  return $items;
}

/**
 * Implements hook_default_search_api_server().
 */
function imagex_alphabetical_sitemap_default_search_api_server() {
  $items = array();
  $items['default_fuzzysearch_server'] = entity_import('search_api_server', '{
    "name" : "Default fuzzysearch server",
    "machine_name" : "default_fuzzysearch_server",
    "description" : "A default server automatically created by fuzzysearch.",
    "class" : "fuzzysearch_service",
    "options" : {
      "database" : "default:default",
      "min_chars" : "3",
      "indexes" : { "default_fuzzysearch_index" : {
          "title" : {
            "table" : "fuzzysearch_default_fuzzysearch_index_title",
            "type" : "text",
            "boost" : "5.0"
          },
          "url" : {
            "table" : "fuzzysearch_default_fuzzysearch_index_url",
            "type" : "text",
            "boost" : "1.0"
          },
          "search_api_language" : {
            "table" : "fuzzysearch_default_fuzzysearch_index_search_api_language",
            "type" : "string",
            "boost" : "1.0"
          },
          "search_api_viewed" : {
            "table" : "fuzzysearch_default_fuzzysearch_index_search_api_viewed",
            "type" : "text",
            "boost" : "1.0"
          },
          "field_tags" : {
            "table" : "fuzzysearch_default_fuzzysearch_index_field_tags",
            "type" : "list\\u003Cinteger\\u003E",
            "boost" : "1.0"
          }
        }
      }
    },
    "enabled" : "1",
    "rdf_mapping" : []
  }');
  return $items;
}
