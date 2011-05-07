(function($, BIG) {
  
  BIG.contentContainer = "#body";
  
  BIG._defaultNavs = [
    'Home #/home',
    'Countries #/country', 
    'Companies #/company',
    'Charting #/chart' 
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
      '/country'       : 'listCountries',
      '/country/:id'   : 'countryProfile',
      '/company'       : 'listCompanies',
      '/company/:id'   : 'companyProfile',
      '/chart'         : 'chart',
      '*actions'       : 'defaultRoute'
    },
    
    homeRoute: function() {
      new BIG.Views.Home().render();
    },
    
    listCompanies: function() {
      new BIG.Views.List({
        type: 'company',
        entities: BIG.Companies.toJSON()
      }).render('View Companies');
    },
    
    listCountries: function() {
      new BIG.Views.List({
        type: 'country',
        entities: BIG.Countries.toJSON() 
      }).render('View Countries');
    },
    
    countryProfile: function(id) {
      var c = BIG.Countries.get(id);
      if(c) {
        new BIG.Views.Country({ model: c }).render();
      } else {
        new BIG.Views.Error().render({
          title: 'Oops...',
          details: 'We couldnt load country data for ' + id
        });
      }
    },
    
    companyProfile: function(id) {
      var c = BIG.Companies.get(id);
       if(c) {
          new BIG.Views.Company({ model: c }).render();
        } else {
          new BIG.Views.Error().render({
            title: 'Oops...',
            details: 'We couldnt load company data for ' + id
          });
        }
    },
    
    chart: function() {
      new BIG.Views.Chart().render();
      new BIG.Views.ChartSearch({
        type: 'chart',
        placeholder: 'Search for Countries...'
      }).render();
    },
    
    defaultRoute: function(actions) {
      
    }
  }))();

  Backbone.history.start();
  
  BIG.init = (function() {
    // get rid of this stuff
    BIG._renderSearchBox('#header', 'header', 'Search Companies, Industries, and Countries...');
    BIG._renderNav('#main-nav', BIG._defaultNavs);
  })();  
  
})(jQuery, BIG);