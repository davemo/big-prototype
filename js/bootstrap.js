(function($) {
  
  window.BIG = {};
  
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
  
  BIG.NumberFormatter = {
    // copy/paste from the YUI number formatter
    format: function(data, config) {
        if(_.isNumber(data)) {
            config = config || {};

            var isNeg = (data < 0),
                output = data + "",
                decPlaces = config.decimalPlaces,
                decSep = config.decimalSeparator || ".",
                thouSep = config.thousandsSeparator,
                decIndex,
                newOutput, count, i;

            // Decimal precision
            if(_.isNumber(decPlaces) && (decPlaces >= 0) && (decPlaces <= 20)) {
                // Round to the correct decimal place
                output = data.toFixed(decPlaces);
            }

            // Decimal separator
            if(decSep !== "."){
                output = output.replace(".", decSep);
            }

            // Add the thousands separator
            if(thouSep) {
                // Find the dot or where it would be
                decIndex = output.lastIndexOf(decSep);
                decIndex = (decIndex > -1) ? decIndex : output.length;
                // Start with the dot and everything to the right
                newOutput = output.substring(decIndex);
                // Working left, every third time add a separator, every time add a digit
                for (count = 0, i=decIndex; i>0; i--) {
                    if ((count%3 === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
                        newOutput = thouSep + newOutput;
                    }
                    newOutput = output.charAt(i-1) + newOutput;
                    count++;
                }
                output = newOutput;
            }

            // Prepend prefix
            output = (config.prefix) ? config.prefix + output : output;

            // Append suffix
            output = (config.suffix) ? output + config.suffix : output;
            
            return output;
        }
        // Not a Number, just return as string
        else {
            return "";
        }
    }
  };
  
  
})(jQuery);