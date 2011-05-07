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
        var o = this.model.toJSON();
        $(this.el).html(this.template({
          name: o.name,
          overview: o.overview.split("\n"),
          overviewType: 'Country'
        }));
      }
    }),

    Company: Backbone.View.extend({

      tagName: "article",
      el: '#body',

      template: _.template($("#overview-template").html()),

      initialize: function() {
        _.bindAll(this, 'render');
      },

      render: function() {
        var o = this.model.toJSON();
        $(this.el).html(this.template({
          name: o.name,
          overview: o.overview.split("\n"),
          overviewType: 'Company'
        }));
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
      
      initialize: function() {
        _.bindAll(this, 'render');
      },
      
      render: function() {
        $(this.el).html(this.template());
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

