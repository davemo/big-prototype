(function($, BIG) {

    BIG.Views = {};

    BIG.Views.Country = Backbone.View.extend({

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
            // if(country.latitude && country.longitude) {
            //   new google.maps.Map($("#map")[0], {
            //     zoom: 6,
            //     center: new google.maps.LatLng(parseFloat(country.latitude, 10), parseFloat(country.longitude, 10)),
            //     mapTypeId: google.maps.MapTypeId.ROADMAP
            //   });
            // }
        }

    });

    BIG.Views.Error = Backbone.View.extend({

        tagName: "div",
        el: '#body',

        template: _.template($("#error-template").html()),

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function(error) {
            $(this.el).html(this.template(error));
        }

    });

    BIG.Views.Home = Backbone.View.extend({

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

    });

    BIG.Views.EntityControls = Backbone.View.extend({

        el: '.entity-controls',

        events: {
            'click .remove': 'removeEntity'
        },

        template: _.template($("#entity-controls").html()),

        initialize: function(attrs) {
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
            var $link = $(e.currentTarget);
            if (this.collection.length > 1) {
                var index = $(".entity-controls ul li a").index($link);
                // TODO: fix the index mismatch here
                BIG.TableData.removeSeries(index);
                this.collection.remove($link.attr("data-id"));
            } else {
                alert('You need at least 1 country to chart!');
            }
        }

    });

    BIG.Views.Controls = Backbone.View.extend({

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
            'click #show-comparison-ui': 'toggleComparisonUI',
            'click #view-chart': 'showChart',
            'click #view-table': 'showTable'
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

    });

    BIG.Views.Chart = Backbone.View.extend({

        el: '.chart',

        template: _.template($("#chart-template").html()),

        initialize: function(attrs) {
            _.bindAll(this, 'render');

            this.collection.bind('add', this.addSeries);
            this.collection.bind('remove', this.removeSeries);
            this.collection.bind('refresh', this.render);

            this.metric = _.select(BIG.Metrics,
            function(metric) {
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

            // TODO : Clean this up at some point.
            $("body").attr("id", "chart");
            // inject the initial spots for both chart and table
            $("#body").html('<div class="chart"></div><div class="table"></div>');
            $(".swapper").buttonset();
            $(".button").button();

            // renders the chart
            $(self.el).html(self.template());

            // renders the table
            BIG.Table = new BIG.Views.Table({
                header: self.metric.name,
                collection: BIG.TableData
            }).render();

            // chart
            BIG.Chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart-container'
                },
                title: {
                    text: self.metric.name + ' by Country and Year'
                },
                xAxis: {
                    type: 'datetime',
                    maxZoom: 24 * 3600 * 1000 * 365 * 10,
                    // 10 years in millis
                    dateTimeLabelFormats: {
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
                    formatter: function() {
                        return 'Year'
                        + ': <strong>' + this.point.name + '</strong>'
                        + '<br/>'
                        + self.metric.name
                        + ': <strong>' + this.point.y + '</strong>';
                    }
                }
            });
        }
    });

    BIG.Views.Navigation = Backbone.View.extend({

        el: '#main-nav',

        template: _.template($("#nav-template").html()),

        render: function() {
            $(this.el).html(this.template({
                links: this.options.links
            }));
        }

    });

    BIG.Views.SiteSearch = Backbone.View.extend({

        el: '#header .search',
        input: '#header .search input',

        events: {
            "focusout input": "hideResults"
        },

        template: _.template($("#search-template").html()),
        resultsTemplate: _.template($("#search-results-template").html()),

        render: function() {
            var self = this;
            $(this.el).html(this.template({
                placeholder: this.options.placeholder,
                type: this.options.type,
                metrics: []
            }));

            // bind autocomplete
            $(this.input).autocomplete({
                minLength: 0,
                source: function(request, response) {
                    var query = request.term;
                    if (query) {
                        response(_.uniq(_.map(_.select(BIG.Countries.toJSON(),
                        function(country) {
                            return country.name.toLowerCase().match(query.toLowerCase() + '*');
                        }),
                        function(country) {
                            return {
                                value: country.id,
                                label: country.name
                            };
                        })));
                    } else {
                        response([]);
                    }
                },
                focus: function(event, ui) {
                    $(this.input).val(ui.item.label);
                    return false;
                },
                select: function(event, ui) {
                    window.location.hash = '#/country/' + ui.item.value;
                    return false;
                }
            }).data("autocomplete")._renderItem = function(ul, item) {
                return $("<li class='result'></li>")
                .data("item.autocomplete", item)
                .append("<a href='" + item.value + "'>" + item.label + "</a>")
                .appendTo(ul);
            };
        },

        hideResults: function() {
            this.$('input').val('');
        }

    });

    BIG.Views.ChartSearch = Backbone.View.extend({

        el: '#controls .search',

        events: {
            "change select": "swapMetric",
            "focusout input": "hideResults"
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

            // bind autocomplete
            $("#search-chart input").autocomplete({
                minLength: 0,
                source: function(request, response) {
                    var query = request.term;
                    if (query) {
                        response(_.map(_.select(BIG.Countries.toJSON(),
                        function(country) {
                            return country.name.toLowerCase().match(query.toLowerCase() + '*');
                        }),
                        function(country) {
                            return {
                                value: country.id,
                                label: country.name
                            };
                        }));
                    } else {
                        response([]);
                    }
                },
                focus: function(event, ui) {
                    $("#search-chart input").val(ui.item.label);
                    return false;
                },
                select: function(event, ui) {
                    var raw = BIG.MetricData.get(ui.item.value + ":" + self.chartView.metric.name);

                    var transposed = BIG._transformMetricToChartSeries(raw);
                    self.collection.add(new BIG.Models.Metric(transposed));

                    var transposedRow = BIG._transformMetricToTableData(raw);
                    BIG.TableData.addRow(transposedRow);
                    return false;
                }
            }).data("autocomplete")._renderItem = function(ul, item) {
                return $("<li class='result'></li>")
                .data("item.autocomplete", item)
                .append("<a href='" + item.value + "'>" + item.label + "</a>")
                .appendTo(ul);
            };
        },

        addEntity: function(e) {
            e.preventDefault();
            $('.results').toggle();
            var cid = $(e.currentTarget).attr("href");
            var raw = BIG.MetricData.get(cid + ":" + this.chartView.metric.name);

            var transposed = BIG._transformMetricToChartSeries(raw);
            this.collection.add(new BIG.Models.Metric(transposed));

            var transposedRow = BIG._transformMetricToTableData(raw);
            BIG.TableData.addRow(transposedRow);
        },

        swapMetric: function(e) {
            var self = this;
            var newMetricId = $(e.currentTarget).find(":selected").text();
            var currentModelIds = _.pluck(this.collection.models, 'id');
            var newModels = _.map(currentModelIds,
            function(id) {
                return new BIG.Models.Metric(
                BIG._transformMetricToChartSeries(BIG.MetricData.get(id + ":" + newMetricId)));
            });
            this.collection.refresh(newModels);
        },

        hideResults: function() {
            this.$('input').val('');
        }

    });

    BIG.Views.Table = Backbone.View.extend({

        el: '.table',

        template: _.template($("#table-template").html()),

        initialize: function(opts) {
            _.bindAll(this, 'render');
            this.header = opts.header;
            this.collection.bind('add', this.render);
            this.collection.bind('remove', this.render);
            this.collection.bind('refresh', this.render);
        },

        render: function(opts) {
            $(this.el).html(this.template({
                header: this.header,
                rows: this.collection.toJSON()
            }));
        }

    });

    BIG.Views.List = Backbone.View.extend({

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
            return _.map(entities,
            function(entity) {
                return {
                    href: '#/' + type + '/' + entity.id,
                    display: entity.name
                };
            });
        }

    });
})(jQuery, BIG);

