(function($) {
  
  BIG = {
    contentContainer: "#body"
  };
  
  BIG.store = {
    put: function(key, val, callback) {
      localStorage.setItem(key, JSON.stringify(val));
      if(typeof(callback) === 'function') {
        callback();
      }
    },
    
    get: function(key, callback) {
      return JSON.parse(localStorage.getItem(key));
    }
  };
  
  BIG._defaultNavs = [
    'Home #/home', 
    'Comparison Tool #/compare' 
  ];
    
  BIG._renderSearchBox = function(container, type, placeholder) {
    $(container).prepend(_.template($("#search-template").html(), {
      type: type, 
      placeholder: placeholder
    }));
  };
  
  BIG._renderNav = function(container, navs) {
    var rendered = "";
    _.each(navs, function(nav) {
      var chunks = nav.split(" ");
      var link = _.last(chunks);
      rendered += _.template($("#nav-template").html(), {
        link: link,
        name: _.without(chunks, link).join(" ")
      });
    });
    $(container).append(rendered);
  };
  
  BIG._loadInitialData = function() {
    _.each(['country', 'company', 'search'], function(type) {
      $.getJSON('/static-data/' + type + '.js', function(response) {
        _.each(response, function(item) {
          BIG.store.put([type,item.name.toLowerCase()].join(":"), item);
        });
      });
    });
  };
  
  BIG.Controller = new (Backbone.Controller.extend({
    routes: {
      '/home'          : 'homeRoute',
      '/country/:name' : 'countryProfile',
      '*actions'       : 'defaultRoute'
    },
    
    homeRoute: function() {
      
    },
    
    countryProfile: function(country) {
      var c = BIG.store.get('country:' + country);
      $(BIG.contentContainer).html("").append(_.template($("#country-template").html(), {
        name: c ? c.name : "Oops... ",
        overview: c ? c.overview.split("\n") : ["We don't have data for " + country.toUpperCase() + " yet."]
      }));
    },
    
    defaultRoute: function(actions) {

    }
  }))();
  
  BIG.init = (function() {
    //BIG._loadInitialData();
    BIG._renderSearchBox('#header', 'header', 'Search Companies, Industries, and Countries...');
    BIG._renderNav('#main-nav', BIG._defaultNavs);
    $.publish('big/loaded');
  })();
  
  Backbone.history.start();
  
})(jQuery);