(function($, BIG) {
    
  BIG.Controller = new (Backbone.Controller.extend({
    routes: {
      '/home'                     : 'homeRoute',
      '/country'                  : 'listCountries',
      '/country/:id'              : 'countryProfile',
      '/chart/:countries/:metric' : 'chart',
      '*actions'                  : 'defaultRoute'
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
    
    chart: function(countries, metric) {
      var d = BIG.MetricData.get(countries + ":" + metric);      
      if(d) {
        var transposed = BIG._transformMetricToChartSeries(d);      
        BIG.ChartSeries.add(new BIG.Models.Metric(transposed));
        var chartView = new BIG.Views.Chart({
          countries: countries,
          metric: metric,
          series: transposed,
          collection: BIG.ChartSeries
        });
        
        new BIG.Views.ChartSearch({
          type: 'chart',
          placeholder: 'Add Countries...',
          metrics: BIG.Metrics,
          collection: BIG.ChartSeries,
          chartView: chartView
        }).render();
        
        chartView.render();
      } else {
        new BIG.Views.Error().render({
          title: 'Oops...',
          details: 'We have not loaded data for ' + countries + ' yet.\n We only have data for Canada, USA, Brazil, India and China'
        });
      }
    },
    
    defaultRoute: function(actions) {
      
    }
  }))();
  
  BIG._transformMetricToChartSeries = function(raw) {
    var metric = raw.toJSON();
    var transposed = {
      name: metric.country.value,
      data: _.map(metric.data, function(fact) {
        return {
          name: fact.date,
          x: Date.parse(fact.date),
          y: parseFloat(fact.value, 10) || null
        }
      })
    };
    return transposed;
  };

  Backbone.history.start();
  
  BIG.init = (function() {
    new BIG.Views.SiteSearch({
      type: 'site',
      placeholder: 'Search Companies, Industries, and Countries...'
    }).render();
    
    new BIG.Views.Navigation({
      links: [
        { href: '#/home', name: 'Home' },
        { href: '#/country', name: 'Countries' }
      ]
    }).render();
  })();  
  
})(jQuery, BIG);