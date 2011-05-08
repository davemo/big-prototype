(function($, BIG) {
  
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
    MetricData: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("metrics")
    }),
    ChartSeries: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("chart")
    })
  };
   
  BIG.Countries      = new BIG.Collections.Countries;
  BIG.Companies      = new BIG.Collections.Companies;
  BIG.Results        = new BIG.Collections.Results;
  BIG.MetricData     = new BIG.Collections.MetricData;
  BIG.ChartSeries    = new BIG.Collections.ChartSeries;
  
  BIG._loadData = function() {
    _.each(
      [
        { collection: "Countries", model: BIG.Models.Country }
      ],
      function(dataType) {
        $.getJSON('static-data/wb.' + dataType.collection.toLowerCase() + '.json', function(response) {
          _.each(response, function(entityData) {
            var entity = new dataType.model(entityData);
            BIG[dataType.collection].add(entity);
            entity.save();
          });
        });      
      }
    );
  };
  
  BIG._loadMetrics = function() {
    _.each(
      [
        { collection: "MetricData"  , model: BIG.Models.Metric, name: "GDP"  },
        { collection: "MetricData"  , model: BIG.Models.Metric, name: "GNI"  }
      ],
      function(metric) {
        
        $.getJSON('static-data/wb.' + metric.name.toLowerCase() + '.json', function(response) {
          _.each(response, function(rawMetricData) {
            // there _has_ to be a more efficient way to do this :P
            var transposed = {
              id: _(rawMetricData[1]).chain().pluck('country').pluck('id').uniq().value()[0] + ":" + metric.name,
              indicator: {
                id: _(rawMetricData[1]).chain().pluck('indicator').pluck('id').uniq().value()[0],
                value: _(rawMetricData[1]).chain().pluck('indicator').pluck('value').uniq().value()[0]
              },
              country: {
                id: _(rawMetricData[1]).chain().pluck('country').pluck('id').uniq().value()[0],
                value: _(rawMetricData[1]).chain().pluck('country').pluck('value').uniq().value()[0]
              },
              data: _.map(rawMetricData[1], function(raw) {
                return {
                  date: raw.date,
                  decimal: raw.decimal,
                  value: raw.value
                }
              })
            };          

            var entity = new metric.model(transposed);
            BIG[metric.collection].add(entity);
            entity.save();
          });
        });
      }
    );
  };
  
  BIG._clearData = function() {
    window.localStorage.clear();
  };
  
})(jQuery, BIG);