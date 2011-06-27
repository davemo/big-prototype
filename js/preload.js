(function($, BIG) {

    BIG._loadCountries = function() {
        $.getJSON('static-data/wb.countries.json',
        function(response) {
            _.each(response,
            function(country) {
                var transposed = _.extend(country, {
                    id: country.iso2Code
                });
                var country = new BIG.Models.Country(transposed);
                BIG.Countries.add(country);
                country.save();
            });
        });
    };

    BIG._loadMetrics = function() {
        _.each(
        [
        {
            collection: "MetricData",
            name: "GDP"
        },
        {
            collection: "MetricData",
            name: "GNI"
        },
        {
            collection: "MetricData",
            name: "Unemployment"
        }
        ],
        function(metric) {

            $.getJSON('static-data/wb.' + metric.name.toLowerCase() + '.json',
            function(response) {
                _.each(response,
                function(rawMetricData) {
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
                        data: _.map(rawMetricData[1],
                        function(raw) {
                            return {
                                date: raw.date,
                                decimal: raw.decimal,
                                value: raw.value
                            }
                        })
                    };

                    var entity = new BIG.Models.Metric(transposed);
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

    var localStorageHasData = localStorage.getItem('countries-CA');

    if(!localStorageHasData) {
      BIG._loadCountries();
      BIG._loadMetrics();
    }
    
    BIG.Countries.fetch();
    BIG.MetricData.fetch();

})(jQuery, BIG);