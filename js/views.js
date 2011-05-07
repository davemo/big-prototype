// 
// BIG.Views = {
//   Country: Backbone.View.extend({
//     
//     tagName: "article",
//     
//     template: _.template($("#country-template").html()),
//     
//     initialize: function() {
//       _.bindAll(this, 'render');
//     },
//     
//     render: function() {
//       $(this.el).html(this.template(this.model.toJSON()));
//     }
//   }),
//   
//   Company: Backbone.View.extend({
//     
//     tagName: "article",
//     
//     template: _.template($("#company-template").html()),
//     
//     initialize: function() {
//       _.bindAll(this, 'render');
//     },
//     
//     render: function() {
//       $(this.el).html(this.template(this.model.toJSON()));
//     }
//     
//   })
// };