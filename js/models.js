(function($, BIG) {
  
  BIG.Models = {
    Country: Backbone.Model.extend({}),
    Company: Backbone.Model.extend({}),
    Result: Backbone.Model.extend({}),
    Metric: Backbone.Model.extend({}),
    TableRow: Backbone.Model.extend({
      id: "YEAR",
      cells: []
    }),
    TableCell: Backbone.Model.extend({
      value: "YEAR:ENTITYID"
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
      localStorage: new Store("table"),
      addRow: function(newRowData) { // addSeries
        if(newRowData.length === this.length) {          
          _.each(this.toJSON(), function(RowModel, i) {
              RowModel.cells.push(newRowData[i].cells[0]);              
          });
          this.trigger('refresh');
        } else {
          alert('something happened bad in addRow');
        }
      },
      removeSeries: function(index) { // removeSeries
        _.each(this.toJSON(), function(RowModel) {
          delete RowModel.cells[index];
        });
        this.trigger('refresh');
      }
    })
  };
   
  BIG.Countries      = new BIG.Collections.Countries;
  BIG.Companies      = new BIG.Collections.Companies;
  BIG.Results        = new BIG.Collections.Results;
  BIG.MetricData     = new BIG.Collections.MetricData;
  BIG.ChartSeries    = new BIG.Collections.ChartSeries;
  BIG.TableData      = new BIG.Collections.TableData;
  
})(jQuery, BIG);