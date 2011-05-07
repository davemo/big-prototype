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
        $(this.el).html(this.template());
      }
      
    }),
    
    Chart: Backbone.View.extend({
      
      el: '#body',
      
      template: _.template($("#chart-template").html()),
      
      initialize: function(chartSeries) {
        _.bindAll(this, 'render');
        this.chartSeries = chartSeries;
      },
      
      render: function() {
        var self = this;
        $(self.el).html(self.template());
        new Highcharts.Chart({
          chart: {
              renderTo: 'chart-container'
           },
           title: {
              text: 'Fruit Consumption'
           },
           xAxis: {
              categories: ['Apples', 'Bananas', 'Oranges']
           },
           yAxis: {
              title: {
                 text: 'Fruit eaten'
              }
           },
           series: [{
              name: 'Jane',
              data: [1, 0, 4]
           }, {
              name: 'John',
              data: [5, 7, 3]
           }]
        });
      }
      
    }),
    
    ChartSearch: Backbone.View.extend({
      
      el: '#chart .controls .search',
      
      events: {
        "keydown input" : "search"
      },
      
      template: _.template($("#search-template").html()),
      
      resultsTemplate: _.template($("#search-results-template").html()),
      
      initialize: function(opts) {
        this.type = opts.type;
        this.placeholder = opts.placeholder;
      },
      
      render: function() {
        var self = this;
        $(this.el).html(this.template({
          type: self.type,
          placeholder: self.placeholder
        }));
      },
      
      search: function(e) {
        if(e.keyCode === 13 && this.$('input').val() !== '') {
          var query = this.$('input').val();
          $(this.el).find('.results').html(this.resultsTemplate({
            results: _.map(_.select(BIG.Countries.toJSON(), function(country) {
              return country.name.match(query + '*');
            }), function(country) {
              return { href: '#/country/' + country.id, display: country.name };
            })
          }));
        }
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

