(function($, BIG) {
  
  BIG.Views = {
    Country: Backbone.View.extend({

      tagName: "article",
      el: '#body',

      template: _.template($("#country-template").html()),

      initialize: function() {
        _.bindAll(this, 'render');
      },

      render: function() {
        var o = this.model ? this.model.toJSON() : undefined;
        $(this.el).html(this.template({
          name: o ? o.name : "Oops...",
          overview: o ? o.overview.split("\n") : ["We don't have any data for this country yet."]
        }));
      }
    }),

    Company: Backbone.View.extend({

      tagName: "article",

      template: _.template($("#company-template").html()),

      initialize: function() {
        _.bindAll(this, 'render');
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
      }

    }),
    
    Error: Backbone.View.extend({
      
      tagName: "div",
      
      template: _.template($("#error-template").html()),
      
      initialize: function() {
        _.bindAll(this, 'render');
      },
      
      render: function() {
        $(this.el).html(this.template({
          title: this.title,
          details: this.details
        }));
      }
      
    })
  };  
})(jQuery, BIG);

