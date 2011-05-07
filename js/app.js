(function($, BIG) {
  
  BIG.contentContainer = "#body";
  
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
  
  _.each([BIG.Countries, BIG.Companies, BIG.Results], function(collection) {
    collection.fetch();
  });
    
  BIG.Controller = new (Backbone.Controller.extend({
    routes: {
      '/home'          : 'homeRoute',
      '/country/:name' : 'countryProfile',
      '*actions'       : 'defaultRoute'
    },
    
    homeRoute: function() {
      
    },
    
    countryProfile: function(country) {
      var c = BIG.Countries.get(country);
      var CountryView = new BIG.Views.Country({
        el: '#body',
        model: c
      });
      CountryView.render();
    },
    
    defaultRoute: function(actions) {
      
    }
  }))();
  
  BIG.init = (function() {
    //BIG._loadInitialData();
    BIG._renderSearchBox('#header', 'header', 'Search Companies, Industries, and Countries...');
    BIG._renderNav('#main-nav', BIG._defaultNavs);
  })();
  
  Backbone.history.start();
  
})(jQuery, BIG);