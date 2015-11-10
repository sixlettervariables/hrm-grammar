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
var hrm = require('../build/hrm.js');
var fs = require('fs');
var Path = require('path');

var KEYWORDS = ['INBOX','OUTBOX','COPYTO','COPYFROM','ADD','SUB','BUMPUP',
                'BUMPDN','JUMP','JUMPZ','JUMPN','DEFINE','LABEL','COMMENT'];

var KW_NOARG  = ['INBOX','OUTBOX'];
var KW_ONEARG = ['COPYTO','COPYFROM','ADD','SUB','BUMPUP','BUMPDN'];
var KW_JUMP   = ['JUMP','JUMPZ','JUMPN'];
var KW_DEF    = ['LABEL','COMMENT'];

test('line comments', function (t) {

  t.test('line comment', function (assert) {
    var parsed = hrm.parse('-- HUMAN RESOURCE MACHINE --');
    assert.ok(parsed, 'can parse just comments');
    assert.equal(parsed.statements.length, 0, 'only line comments has no statements');
    assert.end();
  });

  t.test('line comments with leading spaces', function (assert) {
    var parsed = hrm.parse("        -- HUMAN RESOURCE MACHINE --");
    assert.ok(parsed, 'can parse just comments with leading spaces');
    assert.equal(parsed.statements.length, 0, 'has no statements');
    assert.end();
  });

  t.test('line comments with trailing spaces', function (assert) {
    var parsed = hrm.parse("-- HUMAN RESOURCE MACHINE --              ");
    assert.ok(parsed, 'can parse just comments with trailing spaces');
    assert.equal(parsed.statements.length, 0, 'has no statements');
    assert.end();
  });

  t.test('line comments with leading and trailing spaces', function (assert) {
    var parsed = hrm.parse("   -- HUMAN RESOURCE MACHINE --              ");
    assert.ok(parsed, 'can parse just comments with leading and trailing spaces');
    assert.equal(parsed.statements.length, 0, 'has no statements');
    assert.end();
  });

  t.test('lots of line comments with leading and trailing spaces', function (assert) {
    var parsed = hrm.parse("   -- HUMAN RESOURCE MACHINE --      \t        \r\n-- COMMENT 2 --\r\n\r\n     --COMMENT3--\r\n");
    assert.ok(parsed, 'can parse line comments with leading and trailing spaces');
    assert.equal(parsed.statements.length, 0, 'has no statements');
    assert.end();
  });


  t.test('line comments without trailing dashes', function (assert) {
    var parsed = hrm.parse("   -- HUMAN RESOURCE MACHINE --      \t        \r\n-- COMMENT 2\r\n\r\n     --COMMENT3\r\n");
    assert.ok(parsed, 'can parse line comments with leading and trailing spaces');
    assert.equal(parsed.statements.length, 0, 'has no statements');
    assert.end();
  });

});

test('keyword casing', function (t) {

  t.test('UPPERCASE', function (assert) {
    var parsed = hrm.parse('INBOX\nOUTBOX\nCOPYTO 0\nCOPYFROM 0\nADD 0\nSUB 0\nBUMPUP 0\nBUMPDN 0\nJUMP a\nJUMPZ b\nJUMPN c\nCOMMENT 0\nDEFINE LABEL 0\nBASE64;\nDEFINE COMMENT 0\nBASE64;\n');
    assert.ok(parsed, 'can parse UPPERCASE keywords');

    assert.equal(parsed.statements.length, 14, 'has 14 statement(s)');
    assert.equal(parsed.statements[0].type, 'inbox', 'is an INBOX statement');
    assert.equal(parsed.statements[1].type, 'outbox', 'is an OUTBOX statement');
    assert.equal(parsed.statements[2].type, 'copyto', 'is a COPYTO statement');
    assert.equal(parsed.statements[3].type, 'copyfrom', 'is a COPYFROM statement');
    assert.equal(parsed.statements[4].type, 'add', 'is an ADD statement');
    assert.equal(parsed.statements[5].type, 'sub', 'is a SUB statement');
    assert.equal(parsed.statements[6].type, 'bumpup', 'is a BUMPUP statement');
    assert.equal(parsed.statements[7].type, 'bumpdn', 'is a BUMPDN statement');
    assert.equal(parsed.statements[8].type, 'jump', 'is a JUMP statement');
    assert.equal(parsed.statements[9].type, 'jumpz', 'is a JUMPZ statement');
    assert.equal(parsed.statements[10].type, 'jumpn', 'is a JUMPN statement');
    assert.equal(parsed.statements[11].type, 'comment', 'is a COMMENT statement');
    assert.equal(parsed.statements[12].type, 'define', 'is a DEFINE statement');
    assert.equal(parsed.statements[12].what, 'label', 'is a DEFINE LABEL statement');
    assert.equal(parsed.statements[13].type, 'define', 'is a DEFINE statement');
    assert.equal(parsed.statements[13].what, 'comment', 'is a DEFINE COMMENT statement');

    assert.end();
  });

  t.test('non-UPPERCASE keywords', function (assert) {
    assert.throws(function () {
      var parsed = hrm.parse('inbox\n');
    }, /SyntaxError/, '"inbox" throws SyntaxError');

    assert.throws(function () {
      var parsed = hrm.parse('outbox\n');
    }, /SyntaxError/, '"outbox" throws SyntaxError');

    assert.throws(function () {
      var parsed = hrm.parse('copyto\n');
    }, /SyntaxError/, '"copyto" throws SyntaxError');

    assert.end();
  });

});

test('no arg keywords', function (t) {
  t.test('INBOX', function (assert) {
    var parsed = hrm.parse('\nINBOX');
    assert.ok(parsed, 'can parse "INBOX"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'inbox', 'is an INBOX statement');
    assert.ok(parsed.statements[0]._location, 'has location data');
    assert.equal(parsed.statements[0]._location.start.line, 2, 'line is correct');
    assert.equal(parsed.statements[0]._location.start.column, 1, 'column is correct');
    assert.end();
  });

  t.test('OUTBOX', function (assert) {
    var parsed = hrm.parse(' OUTBOX');
    assert.ok(parsed, 'can parse "OUTBOX"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'outbox', 'is an OUTBOX statement');
    assert.ok(parsed.statements[0]._location, 'has location data');
    assert.equal(parsed.statements[0]._location.start.line, 1, 'line is correct');
    assert.equal(parsed.statements[0]._location.start.column, 2, 'column is correct');
    assert.end();
  });
});

test('one arg keywords', function (t) {
  KW_ONEARG.forEach(function (keyword) {
    t.test(keyword, function (assert) {
      var parsed = hrm.parse(keyword + '     4');
      assert.ok(parsed, 'can parse "' + keyword + '" statement');
      assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
      assert.equal(parsed.statements[0].type, keyword.toLowerCase(), 'is a ' + keyword + ' statement');
      assert.ok(parsed.statements[0].arg, 'has an argument');
      assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
      assert.equal(parsed.statements[0].arg.name, '4', 'has the expected argument ref');

      assert.end();
    });
  });
});

test('one arg (indirect) keywords', function (t) {
  KW_ONEARG.forEach(function (keyword) {
    t.test(keyword + ' indirect', function (assert) {
      var parsed = hrm.parse(keyword + ' [ 4 ]');
      assert.ok(parsed, 'can parse "' + keyword + ' [ 4 ]"');
      assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
      assert.equal(parsed.statements[0].type, keyword.toLowerCase(), 'is a ' + keyword + ' statement');
      assert.ok(parsed.statements[0].arg, 'has an argument');
      assert.equal(parsed.statements[0].arg.type, 'IndirectIdentifier', 'has the expected argument type');
      assert.equal(parsed.statements[0].arg.name, '4', 'has the expected argument ref');

      assert.end();
    });
  });
});

test('labels', function (t) {
  t.test('simple labels', function (assert) {
    var parsed = hrm.parse('a:\nb:\nc:\n      d:\n\n\ne:');
    assert.ok(parsed, 'can parse simple labels');
    assert.equal(parsed.statements.length, 5, 'has 5 statement(s)');
    assert.equal(parsed.statements[0].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[0].label, 'a', 'is the correct label');
    assert.equal(parsed.statements[1].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[1].label, 'b', 'is the correct label');
    assert.equal(parsed.statements[2].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[2].label, 'c', 'is the correct label');
    assert.equal(parsed.statements[3].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[3].label, 'd', 'is the correct label');
    assert.equal(parsed.statements[4].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[4].label, 'e', 'is the correct label');

    assert.end();
  });

  t.test('complex labels', function (assert) {
    var parsed = hrm.parse('ab:\nb123CDE:\n   c12Czeaaa:\n      ddddddddddddddddddddddddddd:\n\n\na123ebc:');
    assert.ok(parsed, 'can parse complex labels');
    assert.equal(parsed.statements.length, 5, 'has 5 statement(s)');
    assert.equal(parsed.statements[0].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[0].label, 'ab', 'is the correct label');
    assert.equal(parsed.statements[1].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[1].label, 'b123CDE', 'is the correct label');
    assert.equal(parsed.statements[2].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[2].label, 'c12Czeaaa', 'is the correct label');
    assert.equal(parsed.statements[3].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[3].label, 'ddddddddddddddddddddddddddd', 'is the correct label');
    assert.equal(parsed.statements[4].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[4].label, 'a123ebc', 'is the correct label');

    assert.end();
  });

  t.test('keyword-like labels', function (assert) {
    var parsed = hrm.parse('inbox:\noutbox:\ncopyto:\ncopyfrom:\nadd:\nsub:\nbumpup:\nbumpdn:\njump:\njumpz:\njumpn:\ndefine:\nlabel:\ncomment:\n');
    assert.ok(parsed, 'can parse valid keyword-like labels');

    KEYWORDS.forEach(function (keyword) {
      assert.throws(function () {
        var parsed = hrm.parse(keyword + ':\nINBOX\nOUTBOX\nJUMP ' + keyword + '\n');
      }, /SyntaxError/, 'cannot parse keyword "' + keyword + '" as a label');
    });

    assert.end();
  });
});

test('jumps', function (t) {
  t.test('JUMP', function (assert) {
    var parsed = hrm.parse(" JUMP a\t");
    assert.ok(parsed, 'can parse " JUMP a\t"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jump', 'is a JUMP statement');
    assert.equal(parsed.statements[0].label, 'a', 'has the expected label');

    KEYWORDS.forEach(function (keyword) {
      assert.throws(function () {
        hrm.parse("JUMP " + keyword + "\n");
      }, /SyntaxError/, 'cannot JUMP to the "' + keyword + '" keyword used like a label');
    });

    assert.end();
  });

  t.test('JUMPZ', function (assert) {
    var parsed = hrm.parse(" JUMPZ ABC123");
    assert.ok(parsed, 'can parse " JUMPZ ABC123"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jumpz', 'is a JUMPZ statement');
    assert.equal(parsed.statements[0].label, 'ABC123', 'has the expected label');

    KEYWORDS.forEach(function (keyword) {
      assert.throws(function () {
        hrm.parse("JUMPZ " + keyword + "\n");
      }, /SyntaxError/, 'cannot JUMPZ to the "' + keyword + '" keyword used like a label');
    });

    assert.end();
  });

  t.test('JUMPN', function (assert) {
    var parsed = hrm.parse("\n\n\n\n\nJUMPN                ZZZZZ");
    assert.ok(parsed, 'can parse "JUMPN                ZZZZZ"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jumpn', 'is a JUMPN statement');
    assert.equal(parsed.statements[0].label, 'ZZZZZ', 'has the expected label');

    KEYWORDS.forEach(function (keyword) {
      assert.throws(function () {
        hrm.parse("JUMPN " + keyword + "\n");
      }, /SyntaxError/, 'cannot JUMPN to the "' + keyword + '" keyword used like a label');
    });

    assert.end();
  });

});

test('misc grammar requirements', function (t) {
  t.test('should accept commands and arguments broken up over multiple lines', function (assert) {
    fs.readdir('test/fixtures', function (err, paths) {
      paths.forEach(function (path) {
        if (/good-linespacing.+\.hrm$/.test(path)) {
          var data = fs.readFileSync(Path.join('test/fixtures', path));
          var source = data.toString();
          var parsed = hrm.parse(source);
          assert.ok(parsed, path + ': accepts commands and arguments broken up over multiple lines');
        }
      });
      assert.end();
    });
  });

  t.test('should reject commands stacked up on the same line', function (assert) {
    fs.readdir('test/fixtures', function (err, paths) {
      paths.forEach(function (path) {
        if (/bad-linespacing.+\.hrm$/.test(path)) {
          var data = fs.readFileSync(Path.join('test/fixtures', path));
          var source = data.toString();
          assert.throws(function () {
            hrm.parse(source);
          }, /SyntaxError/, path + ': rejects commands stacked up on the same line');
        }
      });
      assert.end();
    });
  });
});

test('actual HRM file 1 (strict)', function (t) {
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
    var b64 = parsed.statements[20].data;
    t.equal(b64, 'eJxLY2BgKOCMuVfAaX64iCNmwxZ2wRUVbO4LrVmd51mzXqr6x2yWXsEmG1rKHhH4keOafy5XROAaLtnQe/xN+bcFlrTHCmyYkMS3d6YaL8OcN1z2s4HGMbRI7pzGLNWU7yU+2Vdf8aADSOyq1s6MSE2GvFsak6vFte41X9JW63QzeN3zy+R1j4m5Vs9ay8dtr6zOlW8y35DUrfc6boKOUQpIn0EAi2huoLfU68AQBY3gFTFLQpryVwbp9a8M2jntXcC5pb+9vZc4eLHMb/Jc0u7gFVD5z+tkSamfddbKoNK0B6GlaSAzjsXvzDgWL9vMkKTVU5P8vr8y5XXP6ky9/rTs2Y2ZWd5l6zLqct5mfE5Znfk+EaT+SXNm7MvGzNj39e8Td1V/TnGsPFrIUjG7sbYqt6+01npGdqPzPKvJTXNTZpdOAakPXDRZPnDRIy3/xXrGExcJ+pxdfDCPa+nsxublGybsXWk06euaDROebnrcNndrRP2M7dPrQHp+TJYNjZl3zf/5xsm+Hnu73H/csrdXerzFXORFpv7Rt1oGDKNgFNAJAACvsa2M');

    t.end(err);
  });
});

function countInstructions(program) {
  return program.reduce(function (count, s) {
    return count + (s.type !== 'label' && s.type !== 'define' && s.type !== 'comment' ? 1 : 0);
  }, 0);
}

test('actual HRM file 2 (strict)', function (t) {
  fs.readFile('test/fixtures/syntax-2.hrm', function (err, data) {
    var source = data.toString();
    var parsed = hrm.parse(source);

    t.ok(parsed, 'good syntax is parsed');
    t.equal(parsed.statements.length, 109, 'has 109 statements');
    t.equal(countInstructions(parsed.statements), 69, 'has 69 instructions');

    // 7: COPYTO [21]
    t.equal(parsed.statements[6].type, 'copyto', 'Line 7 is COPYTO [21]');
    t.ok(parsed.statements[6].arg, 'Line 7 is COPYTO [21]');
    t.equal(parsed.statements[6].arg.type, 'IndirectIdentifier', 'Line 7 is COPYTO [21]');
    t.equal(parsed.statements[6].arg.name, '21', 'Line 7 is COPYTO [21]');

    // 28: JUMPZ    m
    t.equal(parsed.statements[27].type, 'jumpz', 'Line 28 is JUMPZ m');
    t.equal(parsed.statements[27].label, 'm', 'Line 28 is JUMPZ m');

    // 100: DEFINE COMMENT 7 ...;
    t.equal(parsed.statements[99].type, 'define', 'Line 100 is DEFINE COMMENT 7...');
    t.equal(parsed.statements[99].what, 'comment', 'Line 100 is DEFINE COMMENT 7...');
    t.equal(parsed.statements[99].ref, '7', 'Line 100 is DEFINE COMMENT 7...');
    t.equal(parsed.statements[99].data,
    'eJyrZWBgqObpXBUlGLzju/i7Q2lS7w7VyhzYry87cc9kOd5FD2XvzZOQXjArSpBlwlx+7UZGwYKS12Jf' +
    'stOknmQ9lN1XCdTOEKv5JZtfS2bxGe0N+0B8Fs3bprGaXJbz1csdrNXaHOtULGys1fYYu6mvNQLJa7g4' +
    'b1/r0LT7rHHT7hsmRbvem7FuPmxlPPmmzfLObts/tbZ2+yrZHAOL1josSwOpzzQKLPpl/iRrmt2ytEX2' +
    '7SkgMRNf5ymfwlgmhEXw1IdFKOc/D81IavL5kn3EK7FY1ruj/bZP4XQTX+ul9n4zVucEsW4WidqxFqTv' +
    'W92byNe1v6OUqiuSN1cI57WVbO9qK0maplTduaq9Zsda/3pgWDRELa9pXt5Z2JRYXNjk6FfTXKd/qslc' +
    'EqT/R9+2dIMpGUk/p13NPDizoVRqllXTthmNM35Oy1phMGXG6gMTZ6zeOqFy5eTexhkq3RVtp7v+1J7u' +
    '6i+r7TYq6OhhzgWZYbREZnH94gWz1Bb3l5UsepKltlgqFiR+c7Fy/sJl29JvrraMf7pGK85zXUaS7KaC' +
    'ksbNxpMbN+ssAakRPnise8PxzNa7p//Ump05WyV/anrq7hNSsd7Hzob3HdkbVn5ob1jOwTeR6/dHJH7c' +
    'W1DycW9FG8eBBbNyDv5d8PyI97KLp6yXMoyCUYAEAAXx3bs', 'Line 100 is DEFINE COMMENT 7...');

    t.end(err);
  });
});

test('actual HRM file 3 (strict)', function (t) {
  fs.readFile('test/fixtures/syntax-3.hrm', function (err, data) {
    var source = data.toString();
    var parsed = hrm.parse(source);

    t.ok(parsed, 'good syntax is parsed');
    t.equal(parsed.statements.length, 85, 'has 85 statements');
    t.equal(countInstructions(parsed.statements), 79, 'has 79 instructions');

    t.end(err);
  });
});

test('actual HRM file 4 (strict)', function (t) {
  fs.readFile('test/fixtures/syntax-4.hrm', function (err, data) {
    var source = data.toString();
    var parsed = hrm.parse(source);

    t.ok(parsed, 'good syntax is parsed');
    t.equal(parsed.statements.length, 134, 'has 134 statements');
    t.equal(countInstructions(parsed.statements), 98, 'has 98 instructions');

    t.end(err);
  });
});
