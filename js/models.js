(function($, BIG) {
  
  BIG.Models = {
    Country: Backbone.Model.extend({}),
    Company: Backbone.Model.extend({}),
    Result: Backbone.Model.extend({}),
    Metric: Backbone.Model.extend({}),
    TableRow: Backbone.Model.extend({
      seriesLabel: "DEFAULT",
      cells: []
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
    MetricData: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("metrics")
    }),
    ChartSeries: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("chart")
    }),
    TableData: Backbone.Collection.extend({
      model: BIG.Models.Metric,
      localStorage: new Store("table")
    })
  };
   
  BIG.Countries      = new BIG.Collections.Countries;
  BIG.Companies      = new BIG.Collections.Companies;
  BIG.Results        = new BIG.Collections.Results;
  BIG.MetricData     = new BIG.Collections.MetricData;
  BIG.ChartSeries    = new BIG.Collections.ChartSeries;
  BIG.TableData      = new BIG.Collections.TableData;
  
})(jQuery, BIG);