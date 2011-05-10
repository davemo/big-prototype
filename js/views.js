(function($, BIG) {
  
  BIG.Views = {
    
    Country: Backbone.View.extend({

      tagName: "article",
      el: '#body',

      template: _.template($("#overview-template").html()),

      initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
      },

      render: function() {
        $("body").attr("id", "country");
        var country = this.model.toJSON();
        $(this.el).html(this.template({
          country: country,
          type: 'Country'
        }));
        if(country.latitude && country.longitude) {
          new google.maps.Map($("#map")[0], {
            zoom: 6,
            center: new google.maps.LatLng(parseFloat(country.latitude, 10), parseFloat(country.longitude, 10)),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
        }
      }
      
    }),
    
    Error: Backbone.View.extend({
      
      tagName: "div",
      el: '#body',
      
      template: _.template($("#error-template").html()),
      
      initialize: function() {
        _.bindAll(this, 'render');        
      },
      
      render: function(error) {
        $(this.el).html(this.template(error));
      }
      
    }),
    
    Home: Backbone.View.extend({
      
      tagName: "div",
      el: '#body',
      
      template: _.template($("#home-template").html()),
      
      initialize: function() {
        _.bindAll(this, 'render');
      },
      
      render: function() {
        $("body").attr("id", "home");
        $(this.el).html(this.template());
      }
      
    }),
    
    EntityControls: Backbone.View.extend({
      
      el: '.entity-controls',
      
      events: {
        'click .remove' : 'removeEntity'
      },
      
      template: _.template($("#entity-controls").html()),
      
      initialize: function() {
        _.bindAll(this, 'render', 'removeEntity');
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.collection.bind('refresh', this.render);
      },
      
      render: function() {
        var self = this;
        $(this.el).html(this.template({
          entities: self.collection.toJSON()
        }));
      },
      
      removeEntity: function(e) {
        e.preventDefault();
        if(this.collection.length > 1) {
          this.collection.remove($(e.currentTarget).attr("data-id"));
        } else {
          alert('You need at least 1 country to chart!');
        }
      }
      
    }),
    
    Controls: Backbone.View.extend({
      
      el: '#controls',
      
      defaults: {
        
        cpTool: '.comparison',
        btn: '#show-comparison-ui',
        chartBtn: '#view-chart',
        tableBtn: '#view-table',
        chart: '.chart',
        table: '.table'
      
      },
      
      events: {
        'click #show-comparison-ui' : 'toggleComparisonUI',
        'click #view-chart' : 'showChart',
        'click #view-table' : 'showTable'
      },
      
      initialize: function() {
        _.bindAll(this, 'showChart', 'showTable');
      },
      
      toggleComparisonUI: function() {
        $(this.defaults.cpTool).toggle();
        $(this.defaults.btn).toggleClass('open');
      },
      
      showChart: function() {
        $(this.defaults.chart).show();
        $(this.defaults.table).hide();
      },
      
      showTable: function() {
        $(this.defaults.table).show();
        $(this.defaults.chart).hide();
      }
      
    }),
    
    Chart: Backbone.View.extend({
      
      el: '.chart',
      
      template: _.template($("#chart-template").html()),
      
      initialize: function(attrs) {
        _.bindAll(this, 'render');
        
        this.collection.bind('add', this.addSeries);
        this.collection.bind('remove', this.removeSeries);
        this.collection.bind('refresh', this.render);        
        this.metric = _.select(BIG.Metrics, function(metric) {
          return metric.name === attrs.metric;
        })[0];        
      },
      
      addSeries: function(series) {
        BIG.Chart.addSeries(series.toJSON());
      },
      
      removeSeries: function(series) {
        var json = series.toJSON();
        var series = BIG.Chart.get(json.id);
        series.remove();
      },
      
      render: function() {
        var self = this;
        $("body").attr("id", "chart");
        $(".swapper").buttonset();
        $(".button").button();
        
        $(self.el).html(self.template());
                        
        BIG.Chart = new Highcharts.Chart({
           chart: {
              renderTo: 'chart-container'
           },
           title: {
              text: self.metric.name + ' by Country and Year'
           },
           xAxis: {
             type: 'datetime',
             maxZoom: 24 * 3600 * 1000 * 365 * 10, // 10 years in millis
             dateTimeLabelFormats:{
               year: '%Y'
             }
           },
           yAxis: {
              title: {
                 text: self.metric.descriptor
              },
              minPadding: 0
           },
           series: self.collection.toJSON(),
           tooltip: {
           formatter : function() {
               return 'Year'  
                   + ': <strong>' + this.point.name + '</strong>' 
                   + '<br/>' 
                   + self.metric.name 
                   + ': <strong>'  + this.point.y + '</strong>';
             }
           }
        });
      }
    }),
    
    Navigation: Backbone.View.extend({
      
      el: '#main-nav',
      
      template: _.template($("#nav-template").html()),
      
      render: function() {
        $(this.el).html(this.template({
          links: this.options.links
        }));
      }
      
    }),
    
    SiteSearch: Backbone.View.extend({
      
      el: '#header',
      
      events: {
        "keydown input"  : "search",
        "focusout input" : "hideResults" 
      },
      
      template: _.template($("#search-template").html()),
      resultsTemplate: _.template($("#search-results-template").html()),
      
      render: function() {
        $(this.el).append(this.template({
          placeholder: this.options.placeholder,
          type: this.options.type,
          metrics: []
        }));
      },
      
      search: function(e) {
        // THIS IS DUPLICATED WITH LOGIC IN CHARTSEARCH VIEW
        if(e.keyCode === 13 && this.$('input').val() !== '') {
          this.$('.results').show();
          var query = this.$('input').val();
          $(this.el).find('.results').html(this.resultsTemplate({
            results: _.map(_.select(BIG.Countries.toJSON(), function(country) {
              return country.name.match(query + '*');
            }), function(country) {
              return { href: '#/country/' + country.id, display: country.name };
            })
          }));
        }
      },
      
      hideResults: function() {
        // THIS IS DUPLICATED WITH LOGIC IN CHARTSEARCH VIEW
        var self = this;
        this.$('input').val('');

        _.delay(function() {
          self.$('.results').hide();
        }, 1000);
      }
      
    }),
    
    Table: Backbone.View.extend({
      
      el: '.table',
      
      template: _.template($("#table-template").html()),
      
      events: {},
      
      initialize: function() {
        
      },
      
      render: function() {
        $(this.el).html(this.template, {});
      }
      
    }),
    
    ChartSearch: Backbone.View.extend({
      
      el: '#controls .search',
      
      events: {
        "keydown input"       : "search",
        "focusout input"      : "hideResults",
        "change select"       : "swapMetric",
        "click .results li a" : "addEntity"
      },
      
      template: _.template($("#search-template").html()),
      resultsTemplate: _.template($("#search-results-template").html()),
      
      initialize: function(opts) {
        _.bindAll(this, 'addEntity', 'swapMetric');
        this.type = opts.type;
        this.placeholder = opts.placeholder;
        this.metrics = opts.metrics;
        this.chartView = opts.chartView;
      },
      
      render: function() {
        var self = this;
        $(this.el).html(this.template({
          type: self.type,
          placeholder: self.placeholder,
          metrics: self.metrics
        }));
      },
      
      addEntity: function(e) {
        e.preventDefault();
        $('.results').toggle();
        var cid = $(e.currentTarget).attr("href");
        var raw = BIG.MetricData.get(cid + ":" + this.chartView.metric.name);
        var transposed = BIG._transformMetricToChartSeries(raw);
        this.collection.add(new BIG.Models.Metric(transposed));
      },
      
      search: function(e) {
        if(e.keyCode === 13 && this.$('input').val() !== '') {
          this.$('.results').show();
          var query = this.$('input').val();
          $(this.el).find('.results').html(this.resultsTemplate({
            results: _.map(_.select(BIG.Countries.toJSON(), function(country) {
              return country.name.match(query + '*');
            }), function(country) {
              return { href: country.id, display: country.name };
            })
          }));
        }
      },
      
      swapMetric: function(e) {
        var self = this;
        var newMetricId = $(e.currentTarget).find(":selected").text();
        var currentModelIds = _.pluck(this.collection.models, 'id');
        var newModels = _.map(currentModelIds, function(id) {
          return new BIG.Models.Metric(
            BIG._transformMetricToChartSeries(
              BIG.MetricData.get(id + ":" + newMetricId)
            )
          );
        });
        this.collection.refresh(newModels);
      },
      
      hideResults: function() {
        var self = this;
        this.$('input').val('');
        _.delay(function() {
          self.$('.results').hide();
        }, 1000);
      }
      
    }),
    
    List: Backbone.View.extend({
      
      el: '#body',
      
      template: _.template($("#list-template").html()),
      
      initialize: function(listOpts) {
        _.bindAll(this, 'render');
        this.type = listOpts.type;
        this.entities = this._computeEntityLinks(listOpts.entities, this.type);
      },
      
      render: function(title) {
        $("body").attr("id", "countries");
        $(this.el).html(this.template({
          title: title,
          results: this.entities
        }));
      },
      
      _computeEntityLinks: function(entities, type) {
        return _.map(entities, function(entity) {
          return { href: '#/' + type + '/' + entity.id, display: entity.name };
        });
      }
            
    })
  };  
})(jQuery, BIG);

