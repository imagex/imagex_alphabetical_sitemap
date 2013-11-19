## Alphabetical Sitemap

The Alphabetical Sitemap module provides a UI for browsing and searching a site's content. It gives you a page with a search bar that uses an instant search interface and browseable links to all letters of the alphabet. When you browse to a letter, the resultant listings show the content from the site that starts with that letter. The interface uses ajax to retrieve search results and letter results and history.js to update the url path for the ajax navigation so that urls are not broken.

The results search results are retrieved using the search_api and the fuzzy_search module for more natural search term parsing. The letter results are retrieved using a view.

There is an administrative page to configure where the alphabetical sitemap should reside: `/admin/config/search/alphabetical_sitemap`, what view should populate the letter results, and what search index should populate the search results. This makes the implementation generic and pluggable.

For the letter results, there is an additional option to parse all words in the title field of the content to display results under one letter if any word in the title contains that letter in question. The item shows up in the listing, in that case, prefixed by the word that the query found in the title that starts with the letter in question.

## Installation

A drupal-org.make file is included to allow you to build the module dependencies with drush make. This module requires:

- ctools
- entity
- features
- fuzzysearch
- history_js
- history_js library
- search_api
- search_api_db
- search_api_views
- spinjs library
- views

*** Note that this module assumes you'll already have installed ctools, entity, features, and views and as such does not provide them in drupal-org.make. If you don't already have these installed, you'll need to add them manually or include them in your profile's drupal-org.make.


## Roadmap

The path forward for the Alphabetical Sitemap is to refactor it as an entity so that any site can use the UI for creating as many instances of it as it likes. For instance, you could create an instance that shows up in a panels layout under a quicktabs tab to search content that is relevant to that section of the site. This enables the ability to have targeted instances of the UI for tailored purposes. In the Academics part of a university site, you could then create an instance that uses this UI to search and browse academic programs in the vein of a program explorer concept.

Refactoring as an entity is currently pending in an issue queue, and will likely be complete by the first week in December 2013.
