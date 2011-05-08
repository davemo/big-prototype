(function($, BIG) {
  
  BIG._loadData = function() {
    _.each(
      [
        { collection: "Countries", model: BIG.Models.Country }
      ],
      function(dataType) {
        $.getJSON('static-data/wb.' + dataType.collection.toLowerCase() + '.json', function(response) {
          _.each(response, function(entityData) {
            var transposed = _.extend(entityData, {
              id: entityData.iso2Code
            });
            var entity = new dataType.model(transposed);
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
  
  _.each([BIG.MetricData, BIG.Countries], function(collection) {
    if(!collection.length) {
      BIG._loadData();
      BIG._loadMetrics();
    }
    collection.fetch();
  });

})(jQuery, BIG);