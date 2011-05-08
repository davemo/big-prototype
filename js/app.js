(function($, BIG) {
  
  BIG.contentContainer = "#body";
  
  BIG.Metrics = [
    {name: 'GDP', code: 'NY.GDP.MKTP.CD', descriptor: 'GDP (current US$)'},
    {name: 'GNI', code: 'NY.GNP.MKTP.CD', descriptor: 'GNI (current US$)'}
    //{name: 'Unemployment Rate', value: 'SL.UEM.TOTL.ZS'},
    //{name: 'Literacy Rate', value: 'SE.ADT.LITR.ZS'},
    //{name: 'Average Life Expectancy', value: 'SP.DYN.LE00.IN'},
    //{name: 'Import of Goods and Services', value: 'NE.IMP.GNFS.ZS'},
    //{name: 'Export of Goods and Services', value: 'NE.EXP.GNFS.ZS'},
    //{name: 'Population Growth', value: 'SP.POP.GROW'}
  ];
  
  BIG._defaultNavs = [
    'Home #/home',
    'Countries #/country', 
    'Charting #/chart' 
  ];
    
  _.each([BIG.MetricData, BIG.Countries], function(collection) {
    collection.fetch();
  });  
    
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
  

  Backbone.history.start();
  
  BIG.init = (function() {
    // get rid of this stuff
    //BIG._renderSearchBox('#header', 'header', 'Search Companies, Industries, and Countries...');
    BIG._renderNav('#main-nav', BIG._defaultNavs);
  })();  
  
})(jQuery, BIG);