/** hrm-grammar
 *
 * Copyright (C) 2015 Christopher A Watford
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
"use strict";

//
// Test general HRM syntax
//
var test = require('tape');
var hrm = require('../build/hrm-strict.js');
var fs = require('fs');

test('actual HRM file 1 (strict)', function (t) {
  t.plan(12);

  fs.readFile('test/fixtures/syntax-1.hrm', function (err, data) {
    var source = data.toString();
    var parsed = hrm.parse(source);

    t.ok(parsed, 'good syntax is parsed');
    t.ok(parsed.statements, 'has statements');

    t.equal(parsed.statements.length, 21);

    t.equal(parsed.statements[0].type, 'label');
    t.equal(parsed.statements[0].label, 'a');

    t.equal(parsed.statements[9].type, 'copyfrom');
    t.equal(parsed.statements[9].arg.type, 'IndirectIdentifier');
    t.equal(parsed.statements[9].arg.name, '4');

    t.equal(parsed.statements[20].type, 'define');
    t.equal(parsed.statements[20].what, 'label');
    t.equal(parsed.statements[20].ref, '4');
    var b64 = parsed.statements[20].data.split(/[\r\n]/).join("");
    t.equal(b64, 'eJxLY2BgKOCMuVfAaX64iCNmwxZ2wRUVbO4LrVmd51mzXqr6x2yWXsEmG1rKHhH4keOafy5XROAaLtnQe/xN+bcFlrTHCmyYkMS3d6YaL8OcN1z2s4HGMbRI7pzGLNWU7yU+2Vdf8aADSOyq1s6MSE2GvFsak6vFte41X9JW63QzeN3zy+R1j4m5Vs9ay8dtr6zOlW8y35DUrfc6boKOUQpIn0EAi2huoLfU68AQBY3gFTFLQpryVwbp9a8M2jntXcC5pb+9vZc4eLHMb/Jc0u7gFVD5z+tkSamfddbKoNK0B6GlaSAzjsXvzDgWL9vMkKTVU5P8vr8y5XXP6ky9/rTs2Y2ZWd5l6zLqct5mfE5Znfk+EaT+SXNm7MvGzNj39e8Td1V/TnGsPFrIUjG7sbYqt6+01npGdqPzPKvJTXNTZpdOAakPXDRZPnDRIy3/xXrGExcJ+pxdfDCPa+nsxublGybsXWk06euaDROebnrcNndrRP2M7dPrQHp+TJYNjZl3zf/5xsm+Hnu73H/csrdXerzFXORFpv7Rt1oGDKNgFNAJAACvsa2M');
  });
});
