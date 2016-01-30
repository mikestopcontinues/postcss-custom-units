// import

var postcss = require('postcss');
var customUnits = require('./index.js');

// fns

function test(css, opts) {
  return postcss(customUnits(opts)).process(css);
}

// run

describe('customUnits()', function () {
  it('should not affect standard output', function () {
    var css = 'body {margin: 1 1em 1px 1vh; font-family: sans-serif;}';

    test(css).then(function (res) {
      expect(res.css).to.equal(css);
    });
  });

  it('should use custom unit in subsequent uses', function () {
    var css = 'body {--unit-bl: 10px; width: 1bl;}';
    var out = 'body {--unit-bl: 10px; width: 10px;}';

    test(css).then(function (res) {
      expect(res.css).to.equal(out);
    });
  });

  it('should use handle floats properly', function () {
    var css = 'body {--unit-bl: 100px; width: 1.5bl; height: 0.25bl;}';
    var out = 'body {--unit-bl: 100px; width: 150px; height: 25px;}';

    test(css).then(function (res) {
      expect(res.css).to.equal(out);
    });
  });

  it('should use allow reassignment', function () {
    var css = 'body {--unit-bl: 1px; width: 1bl; --unit-bl: 2px; height: 1bl;}';
    var out = 'body {--unit-bl: 1px; width: 1px; --unit-bl: 2px; height: 2px;}';

    test(css).then(function (res) {
      expect(res.css).to.equal(out);
    });
  });
});
