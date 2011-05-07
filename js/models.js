(function($, B) {
  
  BIG.Models = {
    Country: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT COUNTRY',
        overview: 'DEFAULT COUNTRY OVERVIEW'
      },
      initialize: function() {
        //console.log("Country model initialized");
      }
    }),
    
    WBCountry: Backbone.Model.extend({}),
    
    Company: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT COMPANY',
        overview: 'DEFAULT COMPANY OVERVIEW'
      },
      initialize: function() {
        //console.log("Company model initialized");
      }
    }),
    
    Result: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT RESULT'
      },
      initialize: function() {
        //console.log("Result model initialized");
      }
    })
  };
  
  BIG.Collections = {
    Countries: Backbone.Collection.extend({
      model: BIG.Models.Country,
      localStorage: new Store("countries")
    }),
    Companies: Backbone.Collection.extend({
      model: BIG.Models.Company,
      localStorage: new Store("companies")
    }),
    Results: Backbone.Collection.extend({
      model: BIG.Models.Result,
      localStorage: new Store("results")
    }),
    WBCountries: Backbone.Collection.extend({
      model: BIG.Models.WBCountry,
      localStorage: new Store("wbcountries")
    })
  };
   
  BIG.Countries   = new BIG.Collections.Countries;
  BIG.WBCountries = new BIG.Collections.WBCountries
  BIG.Companies   = new BIG.Collections.Companies;
  BIG.Results     = new BIG.Collections.Results;
  
  BIG._loadData = function() {
    _.each(
      [
        { collection: 'Countries', model: BIG.Models.Country }, 
        { collection: 'Companies', model: BIG.Models.Company }, 
        { collection: 'Results',   model: BIG.Models.Result  }
      ], 
      function(dataType) {
        $.getJSON('static-data/' + dataType.collection.toLowerCase() + '.js', function(response) {
          _.each(response, function(entityData) {
            var entity = new dataType.model(entityData);
            B[dataType.collection].add(entity);
            entity.save();
          });
        });
      }
    );
  };
  
  BIG._loadWBData = function() {
    _.each(
      [
        { collection: "Countries", model: BIG.Models.WBCountry }
      ],
      function(dataType) {
        $.getJSON('static-data/wb.' + dataType.collection.toLowerCase() + '.json', function(response) {
          _.each(response, function(entityData) {
            var entity = new dataType.model(entityData);
            B["WB" + dataType.collection].add(entity);
            entity.save();
          });
        });      
      }
    );
  }
  
  BIG._clearData = function() {
    window.localStorage.clear();
  };
  
})(jQuery, BIG);