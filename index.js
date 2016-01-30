// import

var postcss = require('postcss');

// export

module.exports = postcss.plugin('postcss-custom-units', function (opts) {
  opts = opts || {};

  var prefix = '--' + (opts.prefix || 'unit') + '-';
  var prefixLength = prefix.length;
  var prefixRx = new RegExp('^' + prefix + '\\w+$', 'i');
  var unitRx = /([\d\.]+)([\w]+)/i;

  return function customUnits(css) {
    var units = {};
    var unitsRx;

    css.walkDecls(function (decl) {
      if (decl.prop.indexOf(prefix) === 0 && prefixRx.test(decl.prop)) {
        var unit = unitRx.exec(decl.value).slice(1, 3);
        unit[0] = parseFloat(unit[0]) || null;

        if (typeof unit[0] === 'number') {
          units[decl.prop.slice(prefixLength)] = {value: unit[0], unit: unit[1]};
          unitsRx = new RegExp('([\\d\\.]+)(' + Object.keys(units).join('|') + ')', 'gi');
        }

        return;
      }

      decl.value = decl.value.replace(unitsRx, function (m, value, unit) {
        value = (parseFloat(value) || 0) * units[unit].value;
        unit = units[unit].unit;
        return value + unit;
      });
    });
  }
});
