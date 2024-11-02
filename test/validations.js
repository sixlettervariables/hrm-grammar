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
var fs = require('fs');
var levels = require('hrm-level-data');
var hrm = require('../index.js').parser;

var COMMANDS = ['COPYTO 0','COPYFROM 0','ADD 0','SUB 0','BUMPUP 0',
                'BUMPDN 0','JUMP a','JUMPZ a','JUMPN a'];
var KW_NOARG  = ['INBOX','OUTBOX'];
var KW_ONEARG = ['COPYTO','COPYFROM','ADD','SUB','BUMPUP','BUMPDN'];
var KW_JUMP   = ['JUMP','JUMPZ','JUMPN'];
var KW_DEF    = ['LABEL','COMMENT'];

test('level restrictions', function (t) {
  t.test('command blacklisting', function (assert) {

    assert.doesNotThrow(function () {
      var parsed = hrm.parse('INBOX\n', { level: { commands: [] } });
    }, 'never throws for "INBOX"');

    assert.doesNotThrow(function () {
      var parsed = hrm.parse('OUTBOX\n', { level: { commands: [] } });
    }, 'never throws for "OUTBOX"');

    COMMANDS.forEach(function (cc) {
      assert.throws(function () {
        var command = cc.split(' ')[0];
        var source = cc;
        var parsed = hrm.parse(source, { level: { commands: [] } });
      }, /SyntaxError/, 'throws when "'+ cc.split(' ')[0] +'" is not approved');
    });

    assert.doesNotThrow(function () {
      var source = 'INBOX\nOUTBOX\n';
      var parsed = hrm.parse(source, { level: levels[0] });
    }, 'does not throw when statements approved for level (hrm-level-data)');

    assert.throws(function () {
      var source = 'a: INBOX\nOUTBOX\nJUMP a\n';
      var parsed = hrm.parse(source, { level: levels[0] });
    }, /SyntaxError/, 'throws when statement not approved for level (hrm-level-data)');

    assert.end();

  });

  t.test('feature blacklisting', function (t2) {

    t2.test('COMMENT blacklisting', function (assert) {
      assert.throws(function () {
        var parsed = hrm.parse('COMMENT 0\n', { level: { commands: [] } });
      }, /SyntaxError/, 'throws when "COMMENT" used and disallowed (1/2)');

      assert.throws(function () {
        var parsed = hrm.parse('COMMENT 0\n', { level: { commands: [], comments: false } });
      }, /SyntaxError/, 'throws when "COMMENT" used and disallowed (2/2)');

      // Level 12 does NOT allow comments
      assert.throws(function () {
        var parsed = hrm.parse('COMMENT 0\n', { level: levels[11] });
      }, /SyntaxError/, 'throws when "COMMENT" used and disallowed (hrm-level-data)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('COMMENT 0\n', { level: { commands: [], comments: true } });
      }, 'does not throw when "COMMENT" used and allowed');

      // Level 13 allows comments
      assert.doesNotThrow(function () {
        var parsed = hrm.parse('COMMENT 0\n', { level: levels[12] });
      }, 'does not throw when "COMMENT" used and allowed (hrm-level-data)');

      assert.throws(function () {
        var parsed = hrm.parse('DEFINE COMMENT 0\nBASE64;\n', { level: { commands: [] } });
      }, /SyntaxError/, 'throws when "DEFINE COMMENT" used and disallowed (1/2)');

      assert.throws(function () {
        var parsed = hrm.parse('DEFINE COMMENT 0\nBASE64;\n', { level: { commands: [], comments: false } });
      }, /SyntaxError/, 'throws when "DEFINE COMMENT" used and disallowed (2/2)');

      // Level 12 does NOT allow comments
      assert.throws(function () {
        var parsed = hrm.parse('DEFINE COMMENT 0\nBASE64;\n', { level: levels[11] });
      }, /SyntaxError/, 'throws when "DEFINE COMMENT" used and disallowed (hrm-level-data)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE COMMENT 0\nBASE64;\n', { level: { commands: [], comments: true } });
      }, 'does not throw when "DEFINE COMMENT" used and allowed');

      // Level 12 allows comments
      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE COMMENT 0\nBASE64;\n', { level: levels[12] });
      }, 'does not throw when "DEFINE COMMENT" used and allowed (hrm-level-data)');

      assert.end();
    });

    t2.test('DEFINE LABEL blacklisting', function (assert) {
      assert.throws(function () {
        var parsed = hrm.parse('DEFINE LABEL 0\nBASE64;\n', { level: { commands: [] } });
      }, /SyntaxError/, 'throws when "DEFINE LABEL" used and disallowed (1/2)');

      assert.throws(function () {
        var parsed = hrm.parse('DEFINE LABEL 0\nBASE64;\n', { level: { commands: [], labels: false } });
      }, /SyntaxError/, 'throws when "DEFINE LABEL" used and disallowed (2/2)');

      assert.throws(function () {
        var parsed = hrm.parse('DEFINE LABEL 0\nBASE64;\n', { level: levels[18] });
      }, /SyntaxError/, 'throws when "DEFINE LABEL" used and disallowed (hrm-level-data)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE LABEL 0\nBASE64;\n', { level: { commands: [], labels: true } });
      }, 'does not throw when "DEFINE LABEL" used and allowed');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE LABEL 0\nBASE64;\n', { level: levels[19] });
      }, 'does not throw when "DEFINE LABEL" used and allowed (hrm-level-data)');

      assert.end();
    });

    t2.test('Indirect addressing blacklisting', function (assert) {
      KW_ONEARG.forEach(function (cc) {
        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [0]\n', { level: { commands: [cc] } });
        }, /SyntaxError/, 'throws when indirect addressing used by '+cc+' and disallowed (1/2)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [0]\n', { level: { commands: [cc], dereferencing: false } });
        }, /SyntaxError/, 'throws when indirect addressing used by '+cc+' and disallowed (2/2)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [0]\n', { level: levels[27] });
        }, /SyntaxError/, 'throws when indirect addressing used by '+cc+' and disallowed (hrm-level-data)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [0]\n', { level: { commands: [cc], dereferencing: true } });
        }, 'does not throw when indirect addressing used by '+cc+' and allowed');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [0]\n', { level: levels[28] });
        }, 'does not throw when indirect addressing used by '+cc+' and allowed (hrm-level-data)');
      });

      assert.end();
    });

  });

  t.test('Tile addressing validation', function (t2) {
    t2.test('Direct addressing', function (assert) {
      KW_ONEARG.forEach(function (cc) {
        assert.throws(function () {
          var parsed = hrm.parse(cc + ' 5\n', { level: { commands: [cc] }, validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (no tiles allowed)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' 5\n', { level: { commands: [cc], floor: { rows: 1, columns: 3 } }, validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (invalid tile for floor size)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' 10\n', { level: levels[19], validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (hrm-level-data, invalid tile for floor size)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 5\n', { level: { commands: [cc], floor: { rows: 2, columns: 3 } }, validateTiles: true });
        }, 'does not throw when tile referenced by '+cc+' is valid (validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 9\n', { level: levels[19], validateTiles: true });
        }, 'does not throw when tile referenced by '+cc+' is valid (hrm-level-data, validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 5\n', { level: { commands: [cc], floor: { rows: 2, columns: 3 } }, validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is valid (NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 9\n', { level: levels[19], validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is valid (hrm-level-data, NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 5\n', { level: { commands: [cc], floor: { rows: 1, columns: 3 } }, validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is invalid (NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' 10\n', { level: levels[19], validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is invalid (hrm-level-data, NOT validating tiles)');
      });

      assert.end();
    });

    t2.test('Indirect addressing', function (assert) {
      KW_ONEARG.forEach(function (cc) {
        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: { commands: [cc] }, dereferencing: true, validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (no tiles allowed)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: { commands: [cc], dereferencing: true, floor: { rows: 1, columns: 3 } }, validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (invalid tile for floor size)');

        assert.throws(function () {
          var parsed = hrm.parse(cc + ' [10]\n', { level: levels[33], validateTiles: true });
        }, /SyntaxError/, 'throws when tile referenced by '+cc+' is not valid (hrm-level-data, invalid tile for floor size)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: { commands: [cc], dereferencing: true, floor: { rows: 2, columns: 3 } }, validateTiles: true });
        }, 'does not throw when tile referenced by '+cc+' is valid (validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: levels[33], validateTiles: true });
        }, 'does not throw when tile referenced by '+cc+' is valid (hrm-level-data, validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: { commands: [cc], dereferencing: true, floor: { rows: 2, columns: 3 } }, validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is valid (NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: levels[33], validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is valid (hrm-level-data, NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [5]\n', { level: { commands: [cc], dereferencing: true, floor: { rows: 1, columns: 3 } }, validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is invalid (NOT validating tiles)');

        assert.doesNotThrow(function () {
          var parsed = hrm.parse(cc + ' [10]\n', { level: levels[33], validateTiles: false });
        }, 'does not throw when tile referenced by '+cc+' is invalid (hrm-level-data, NOT validating tiles)');
      });

      assert.end();
    });

    t2.test('DEFINE LABEL references', function (assert) {
      assert.throws(function () {
        var parsed = hrm.parse('DEFINE LABEL 5\nBASE64;\n', { level: { commands: [], labels: true }, validateTiles: true });
      }, /SyntaxError/, 'throws when tile referenced by DEFINE LABEL is not valid (no tiles allowed)');

      assert.throws(function () {
        var parsed = hrm.parse('DEFINE LABEL 5\nBASE64;\n', { level: { commands: [], labels: true, floor: { rows: 1, columns: 3 } }, validateTiles: true });
      }, /SyntaxError/, 'throws when tile referenced by DEFINE LABEL is not valid (invalid tile for floor size)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE LABEL 5\nBASE64;\n', { level: { commands: [], labels: true, floor: { rows: 2, columns: 3 } }, validateTiles: true });
      }, 'does not throw when tile referenced by DEFINE LABEL is valid (and validating tiles)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE LABEL 5\nBASE64;\n', { level: { commands: [], labels: true, floor: { rows: 2, columns: 3 } }, validateTiles: false });
      }, 'does not throw when tile referenced by DEFINE LABEL is valid (and NOT validating tiles)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE LABEL 5\nBASE64;\n', { level: { commands: [], labels: true, floor: { rows: 1, columns: 3 } }, validateTiles: false });
      }, 'does not throw when tile referenced by DEFINE LABEL is invalid (and NOT validating tiles)');

      assert.end();
    });

    t2.test('COMMENT references are unaffected', function (assert) {
      assert.doesNotThrow(function () {
        var parsed = hrm.parse('COMMENT 5\n', { level: { commands: [], comments: true, floor: { rows: 1, columns: 3 } }, validateTiles: true });
      }, 'does not throw on COMMENT references (when validating tiles)');

      assert.doesNotThrow(function () {
        var parsed = hrm.parse('DEFINE COMMENT 5\nBASE64;\n', { level: { commands: [], comments: true, floor: { rows: 1, columns: 3 } }, validateTiles: true });
      }, 'does not throw on DEFINE COMMENT references (when validating tiles)');

      assert.end();
    });
  });
});
