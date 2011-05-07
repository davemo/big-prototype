(function($, B) {
  
  BIG.Models = {
    Country: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT COUNTRY',
        overview: 'DEFAULT COUNTRY OVERVIEW'
      },
      initialize: function() {
        console.log("Country model initialized");
      }
    }),
    
    Company: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT COMPANY',
        overview: 'DEFAULT COMPANY OVERVIEW'
      },
      initialize: function() {
        console.log("Company model initialized");
      }
    }),
    
    Result: Backbone.Model.extend({
      defaults: {
        name: 'DEFAULT RESULT'
      },
      initialize: function() {
        console.log("Result model initialized");
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
    })
  };
   
  BIG.Countries = new BIG.Collections.Countries;
  BIG.Companies = new BIG.Collections.Companies;
  BIG.Results   = new BIG.Collections.Results;
  
  BIG._loadData = function() {
    _.each(
      [
        { collection: 'Countries', model: BIG.Models.Country }, 
        { collection: 'Companies', model: BIG.Models.Company }, 
        { collection: 'Results',   model: BIG.Models.Result  }
      ], 
      function(dataType) {
        $.getJSON('/static-data/' + dataType.collection.toLowerCase() + '.js', function(response) {
          _.each(response, function(entityData) {
            var entity = new dataType.model(entityData);
            B[dataType.collection].add(entity);
            entity.save();
          });
        });
      }
    );
  };
  
})(jQuery, BIG);