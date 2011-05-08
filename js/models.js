(function($, B) {
  
  BIG.Models = {
    Country: Backbone.Model.extend({}),
    Company: Backbone.Model.extend({}),
    Result: Backbone.Model.extend({}),
    Metric: Backbone.Model.extend({})
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
    Metrics: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("metrics")
    })
  };
   
  BIG.Countries   = new BIG.Collections.Countries;
  BIG.Companies   = new BIG.Collections.Companies;
  BIG.Results     = new BIG.Collections.Results;
  BIG.Metrics     = new BIG.Collections.Metrics;
  
  BIG._loadData = function() {
    _.each(
      [
        { collection: "Countries", model: BIG.Models.Country }
      ],
      function(dataType) {
        $.getJSON('static-data/wb.' + dataType.collection.toLowerCase() + '.json', function(response) {
          _.each(response, function(entityData) {
            var entity = new dataType.model(entityData);
            B[dataType.collection].add(entity);
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