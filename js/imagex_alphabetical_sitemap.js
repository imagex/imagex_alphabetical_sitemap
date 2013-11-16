/**
 * @file Alpha Sitemap A-Z page interaction and functionality.
 */

/*
 *  IE-specific polyfill which enables the passage of arbitrary arguments to the
 *  callback functions of javascript timers (HTML5 standard syntax).
 *
 *  https://developer.mozilla.org/en-US/docs/DOM/window.setInterval
 *
 *  Syntax:
 *  var timeoutID = window.setTimeout(func, delay, [param1, param2, ...]);
 *  var timeoutID = window.setTimeout(code, delay);
 *  var intervalID = window.setInterval(func, delay[, param1, param2, ...]);
 *  var intervalID = window.setInterval(code, delay);
 *
 */
if (document.all && !window.setTimeout.isPolyfill) {
  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;
}

if (document.all && !window.setInterval.isPolyfill) {
  var __nativeSI__ = window.setInterval;
  window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setInterval.isPolyfill = true;
}
/*
 * End IE-specific polyfill.
 */

(function($) {

  $(document).ready(function() {

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){
    // Note: We are using statechange instead of popstate
        var State = History.getState();
        // Note: We are using History.getState() instead of event.state
        // History.log(State.data, State.title, State.url);

        AlphaSitemap.update.all(State.hash);

    });

    AlphaSitemap.bind.search();

    AlphaSitemap.bind.nav();

    var State = History.getState();

    AlphaSitemap.update.form(State.hash);

    AlphaSitemap.bind.pager();

    AlphaSitemap.update.all(State.hash);

  });

  /**
   * AlphaSitemap object.
   *
   * @property update
   *   Updates the content involved in the search results and surrounding UI
   *   features.
   *   @property all
   *     Update form, results, and all attributes.
   *   @property form
   *     Change form field values to reflect the current query.
   *   @property selectors
   *     Updates classes and nav elements to reflect current state.
   *   @property results
   *     Retrieve search results via ajax and update.
   *
   * @property bind
   *   Binds various DOM elements at the right time in the workflow.
   *   @property pager
   *     Binds events to the pager.
   *   @property search
   *     Binds events on the search input field.
   *   @property nav
   *     Binds events on the navigation links.
   *
   * @property helper
   *   Provides additional operations for reusable procedures.
   *   @property onKeyDown
   *     Callback for evaluating keyDown events.
   *   @property onKeyUp
   *     Callback for evaluating keyUp events.
   *   @property searchTimeout
   *     Timout routine for delaying response after events for better
   *     performance and usability.
   *   @property delay
   *     Helper function to construct actual timeouts.
   *
   * @property get
   *   Retrieves data for use.
   *   @property queryParams
   *     Retrieves the query parameters from the URL.
   *   @property queryString
   *     Retrieves the query string from the document or hash.
   *
   * @property format
   *   Formats data for use.
   *   @property query
   *     Formats the query by converting object into string.
   *
   * @property change
   *   Changes attributes and/or elements. Contains triggers that invoke other
   *   property functions.
   *   @property url
   *     Change the url using History.js pushstate. This triggers all other
   *     changes that happen in the update property functions.
   */
  var AlphaSitemap = {

    update : {

      /**
       * Helper to update form and results based on query as retrieved from a url
       * change.
       */
      all:function(hash) {

        var querystring = AlphaSitemap.get.queryString(hash);

        var params = AlphaSitemap.get.queryParams(querystring);

        var query = AlphaSitemap.format.query(params);

        // TODO: Take a look at this. Why?
        if (query) {

          AlphaSitemap.update.results(query);

        }
        else {

          AlphaSitemap.update.results();

        }

      },

      /**
       * Helper to update search form field values based on parameters.
       *
       * @param params
       *   Key value object containing the parameters and values.
       */
      form:function(hash) {

        var querystring = AlphaSitemap.get.queryString(hash);

        var params = AlphaSitemap.get.queryParams(querystring);

        for (var key in params) {

          switch (key) {

            case 'search':

              $("#edit-search").val(params[key]);

              break;

          }

        }

        // If it turns out there is no search param, make sure to empty the
        // search box.
        if (!params['search']) {

          $("#edit-search").val('');

        }

        AlphaSitemap.update.selectors(params);

      },

      /**
       * Helper to update the selectors that indicate the current navigation
       * status of the page (ie. what letter or search).
       *
       * @param params
       *   Associative array of parameters that should be converted to updated
       *   breadcrumbs.
       */
      selectors:function(params) {

        $('.a-z-nav li').removeClass('selected');

        if (params['letter'] || params['search']) {

          for (var key in params) {

            if (key == 'letter') {

              $('.a-z-nav .' + params[key]).addClass('selected');

            }

            if (key == 'search') {

              $('.a-z-nav li.search').addClass('selected');

            }

          }

        }
        else {

          $('.a-z-nav .all').addClass('selected');

        }

      },

      /**
       * Helper place an AJAX request and update the search results with its
       * response.
       *
       * @param query
       *   String of parameters and values to use to filter the search results.
       */
      results:function(query) {

        // var crumbs = $("#discount-crumbs");
        var resultsContainer = $("#a-z-list");
        resultsContainer.append('<div id="a-z-waiting"></div>');
        var resultsHeight = resultsContainer.height();
        var resultsWidth = resultsContainer.width();
        var resultsPosition = resultsContainer.position();
        var waiting = $("#a-z-waiting");

        waiting.css({
          'top': '125px',
          'left': 0,
          'width':resultsWidth,
          'height':resultsHeight,
          'position':'absolute'
        });

        // Options for spin.js spinner.
        // @see http://fgnass.github.com/spin.js/
        var opts = {
          lines: 13, // The number of lines to draw
          length: 7, // The length of each line
          width: 4, // The line thickness
          radius: 10, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          color: '#000', // #rgb or #rrggbb
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };

        var target = document.getElementById('a-z-waiting');
        // Invoke spin.js loading spinner.
        var spinner = new Spinner(opts).spin(target);

        $.ajax({
          type: "GET",
          url: Drupal.settings.basePath + "a-z-ahah",
          data: query,
          dataType : 'html',
          success: function(data) {

            $("#a-z-list").html(data).effect("highlight", {"color":"#F6FBFE"}, 1200);

            AlphaSitemap.bind.pager();

          },
          error: function (jqXHR, textStatus, errorThrown) {
            //alert('An error occured: ' + testStatus);
          }
        });

      }

    },

    bind : {

      /**
       * Helper to bind events after search results return.
       */
      pager:function() {

        $('.pager-item a').each(function() {

          var path = $(this).attr('href');
          var params = AlphaSitemap.get.queryParams(path);
          var query = AlphaSitemap.format.query(params);

          $(this).attr('href', location.pathname + '?' + query);

        });

        $('.pager-item a, .pager-first a, .pager-previous a, .pager-next a, .pager-last a').bind('click', function(event) {

          if (event.preventDefault) {
            event.preventDefault();
          }
          else {
            event.returnValue = false;
          }

          var params = AlphaSitemap.get.queryParams($(this).attr('href'));

          AlphaSitemap.change.url('page', params['page'] ? params['page'] : '');

        });

      },

      /**
       * Helper to bind to the search field.
       */
      search:function() {

        $('#edit-search').keyup(function(event) {

          AlphaSitemap.helper.onKeyUp(this, event);

        })
        .keydown(function(event) {

          return AlphaSitemap.helper.onKeyDown(this, event);

        })
        .bind('cut paste', function(event) {

          AlphaSitemap.helper.searchTimeout(this, event, 100);

        })
        .focus(function() {

          if ($(this).val() != '') {

            AlphaSitemap.change.url('search', $(this).val());

          }

        })
        .blur(function() {

          if ($(this).val() == '') {

            // AlphaSitemap.change.url('letter', 'all');

          }

        });

      },

      /**
       * Helper to bind to the navigation links.
       */
      nav:function() {

        $('.a-z-nav a').bind('click', function(event){

          if (event.preventDefault) {
            event.preventDefault();
          }
          else {
            event.returnValue = false;
          }

          AlphaSitemap.change.url('letter', $(this).text());

        });

      }

    },

    helper : {

      /**
       * Handler for the "keydown" event.
       *
       * Taken from Drupal's autocomplete.js.
       */
      onKeyDown:function (input, e) {
        if (!e) {
          e = window.event;
        }
        switch (e.keyCode) {
          case 40: // down arrow.
            // this.selectDown();
            return false;
          case 38: // up arrow.
            // this.selectUp();
            return false;
          case 13: // Enter.

            if (e.preventDefault) {
              e.preventDefault();
            }
            else {
              e.returnValue = false;
            }
            AlphaSitemap.helper.searchTimeout(input, e, 50);

            return true;
          default: // All other keys.
            return true;
        }
      },

      /**
       * Handler for the "keyup" event.
       *
       * Taken from Drupal's autocomplete.js.
       */
      onKeyUp:function (input, e) {
        if (!e) {
          e = window.event;
        }
        switch (e.keyCode) {
          case 16: // Shift.
          case 17: // Ctrl.
          case 18: // Alt.
          case 20: // Caps lock.
          case 33: // Page up.
          case 34: // Page down.
          case 35: // End.
          case 36: // Home.
          case 37: // Left arrow.
          case 38: // Up arrow.
          case 39: // Right arrow.
          case 40: // Down arrow.
          case 9:  // Tab.
          case 13: // Enter.
            return true;

          case 27: // Esc.

            $(input).blur();

            return true;

          case 8: // Backspace.
          case 46: // Delete.

              AlphaSitemap.helper.searchTimeout(input, e, 600);

            return true;

          default: // All other keys.

              AlphaSitemap.helper.searchTimeout(input, e, 300);

            return true;
        }
      },

      /**
       * Clears and creates new timeout before changing the url to initiate a
       * search. This is done to create a delay so that every key press does
       * not initiate a new search request, which would dramatically harm
       * usability and put undue stress on performance.
       *
       * Taken in part from jquery.ui.autocomplete.js line 384.
       */
      searchTimeout:function( input, event, timeout ) {

        clearTimeout( this.searching );
        this.searching = AlphaSitemap.helper.delay(function() {

          if (input.value != this.value) {

            AlphaSitemap.change.url('search', input.value);
            this.value = input.value;

          }
          else {

            // Search results have already returned. Go ahead and highlight the
            // results to make the user feel like hitting enter does something.
            if (event.keyCode == 13) {

              $("#a-z-list").effect("highlight", {"color":"#FFFFBB"}, 500);

            }

          }

        }, timeout );

      },

      /**
       * Sets a timeout.
       *
       * Taken directly from jquery.ui.widget.js line 425.
       */
      delay: function( handler, delay ) {

        function handlerProxy() {
          return ( typeof handler === "string" ? instance[ handler ] : handler )
            .apply( instance, arguments );
        }

        var instance = this;

        return setTimeout( handlerProxy, delay || 0 );

      }

    },

    get : {

      /**
       * Helper to retrieve the query parameters from the URL.
       *
       * @param qs
       *   Value of document.location.search.
       *
       * @return
       *   Key value object containing the URL parameters and values.
       */
      queryParams:function(qs) {

        qs = qs.split("?")[1] ? qs.split("?")[1] : qs;
        qs = qs.split("+").join(" ");
        var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {

            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);

        }

        return params;

      },

      /**
       * Getter to retrieve the querystring from the document location.
       *
       * @return
       *   String containing url query.
       */
      queryString:function(hash) {

        var querystring = document.location.search;

        if (!querystring && hash) {

          querystring = hash.substring(hash.indexOf("?"));

        }

        return querystring;

      }

    },

    format : {

      /**
       * Helper to convert a key value object into a string.
       *
       * @param params
       *   Key value object containing the parameters and values.
       *
       * @return
       *   String of key value object for URL .
       */
      query:function(params) {

        var query = '';
        var counter = 0;

        for (var key in params) {

          if (counter != 0) {

            query += '&' + key + '=' + params[key];

          }
          else {

            query = key + '=' + params[key];

          }

          counter++;

        }

        return query;

      }

    },

    change : {

      /**
       * Helper to change the URL query parameters.
       *
       * @param key
       *   Key of the parameter to update.
       * @param value
       *   The value to update the parameter with.
       * @param history
       *   Optional boolean whether browser should record the URL change in browser
       *   history. Defaults to true/yes it should.
       */
      url:function(key, value, history) {

        history = history || true;

        var hash = History.getHash();

        var querystring = AlphaSitemap.get.queryString(hash);

        var params = AlphaSitemap.get.queryParams(querystring);

        params[key] = value;

        if (value == '') {

          delete params[key];

        }

        // If a new letter is selected, reset the pager and remove search.
        if (key == 'letter') {

          delete params['page'];
          delete params['search'];

        }

        // If a new search is placed, reset the pager and remove letter.
        if (key == 'search') {

          delete params['page'];
          delete params['letter'];

        }

        // Update the selectors now so user has immediate feedback.
        AlphaSitemap.update.selectors(params);

        var query = AlphaSitemap.format.query(params);

        var url = [location.protocol, '//', location.host, location.pathname].join('');

        if (history) {

          History.pushState(null, null, url + '?' + query);

        }
        else {

          History.replaceState(null, null, url + '?' + query);

        }

      }

    }

  };

})(jQuery);



