//
// Test general HRM syntax
//
var test = require('tape');
var hrm = require('../lib/hrm-extended.js');
var fs = require('fs');

test('general HRM syntax (extended)', function (t) {
  t.plan(2);

  fs.readFile('test/fixtures/syntax-extended-1.hrm', function (err, data) {
    var source = data.toString();
    var parsed = hrm.parse(source);

    t.ok(parsed, 'good syntax is parsed');
    t.ok(parsed.statements, 'has statements');
  });
});
