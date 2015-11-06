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
  t.test('lowercase', function (assert) {
    var parsed = hrm.parse('inbox\noutbox\ncopyto 0\ncopyfrom 0\nadd 0\nsub 0\nbumpup 0\nbumpdn 0\njump a\njumpz b\njumpn c\ncomment 0\ndefine label 0\nBASE64;\ndefine comment 0\nBASE64;\n');
    assert.ok(parsed, 'can parse lowercase keywords');

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

  t.test('MiXEdcASe', function (assert) {
    var parsed = hrm.parse('INbOX\nOutBOX\nCOpytO 0\nCopyFrom 0\nAdD 0\nsUB 0\nbumpUP 0\nBUMPdn 0\nJumP a\njumpZ b\nJumpn c\ncoMMent 0\ndeFINe LaBEl 0\nBASE64;\nDEFIne COMMENt 0\nBASE64;\n');
    assert.ok(parsed, 'can parse MiXEdcASe keywords');

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

});

test('no arg keywords', function (t) {
  t.test('inbox', function (assert) {
    var parsed = hrm.parse('\ninbox');
    assert.ok(parsed, 'can parse "inbox"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'inbox', 'is an INBOX statement');
    assert.ok(parsed.statements[0]._location, 'has location data');
    assert.equal(parsed.statements[0]._location.start.line, 2, 'line is correct');
    assert.equal(parsed.statements[0]._location.start.column, 1, 'column is correct');
    assert.end();
  });

  t.test('outbox', function (assert) {
    var parsed = hrm.parse(' outbox');
    assert.ok(parsed, 'can parse "outbox"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'outbox', 'is an OUTBOX statement');
    assert.ok(parsed.statements[0]._location, 'has location data');
    assert.equal(parsed.statements[0]._location.start.line, 1, 'line is correct');
    assert.equal(parsed.statements[0]._location.start.column, 2, 'column is correct');
    assert.end();
  });
});

test('one arg keywords', function (t) {
  t.test('copyto', function (assert) {
    var parsed = hrm.parse('copyto     4');
    assert.ok(parsed, 'can parse "copyto     4"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'copyto', 'is a COPYTO statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '4', 'has the expected argument ref');

    assert.end();
  });

  t.test('copyfrom', function (assert) {
    var parsed = hrm.parse('   copyfrom 9  -- COPYING FROM 9');
    assert.ok(parsed, 'can parse "   copyfrom 9  -- COPYING FROM 9"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'copyfrom', 'is a COPYFROM statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '9', 'has the expected argument ref');

    assert.end();
  });

  t.test('add', function (assert) {
    var parsed = hrm.parse('add 0');
    assert.ok(parsed, 'can parse "add 0"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'add', 'is a ADD statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '0', 'has the expected argument ref');

    assert.end();
  });

  t.test('sub', function (assert) {
    var parsed = hrm.parse("-- HUMAN RESOURCE MACHINE PROGRAM --\n\n\n\nsub                2\n");
    assert.ok(parsed, 'can parse "sub            2"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'sub', 'is a SUB statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '2', 'has the expected argument ref');

    assert.end();
  });

  t.test('bumpup', function (assert) {
    var parsed = hrm.parse('bumpup 11111');
    assert.ok(parsed, 'can parse "bumpup 11111"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'bumpup', 'is a BUMPUP statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '11111', 'has the expected argument ref');

    assert.end();
  });

  t.test('bumpdn', function (assert) {
    var parsed = hrm.parse(" bumpdn 9\t");
    assert.ok(parsed, 'can parse " bumpdn 9\t"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'bumpdn', 'is a BUMPDN statement');
    assert.ok(parsed.statements[0].arg, 'has an argument');
    assert.equal(parsed.statements[0].arg.type, 'Identifier', 'has the expected argument type');
    assert.equal(parsed.statements[0].arg.name, '9', 'has the expected argument ref');

    assert.end();
  });
});

test('one arg (indirect) keywords', function (t) {
  var keywords = [ 'copyto', 'copyfrom', 'add', 'sub', 'bumpup', 'bumpdn' ];

  keywords.forEach(function (keyword) {
    t.test(keyword + ' indirect', function (assert) {
      var parsed = hrm.parse(keyword + ' [ 4 ]');
      assert.ok(parsed, 'can parse "' + keyword + ' [ 4 ]"');
      assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
      assert.equal(parsed.statements[0].type, keyword, 'is a ' + keyword + ' statement');
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
    var parsed = hrm.parse('a__b:\nb123CDE:\n   __c12Cz_eaaa:\n      _d_:\n\n\n123ebc:');
    assert.ok(parsed, 'can parse complex labels');
    assert.equal(parsed.statements.length, 5, 'has 5 statement(s)');
    assert.equal(parsed.statements[0].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[0].label, 'a__b', 'is the correct label');
    assert.equal(parsed.statements[1].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[1].label, 'b123CDE', 'is the correct label');
    assert.equal(parsed.statements[2].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[2].label, '__c12Cz_eaaa', 'is the correct label');
    assert.equal(parsed.statements[3].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[3].label, '_d_', 'is the correct label');
    assert.equal(parsed.statements[4].type, 'label', 'is a LABEL statement');
    assert.equal(parsed.statements[4].label, '123ebc', 'is the correct label');

    assert.end();
  });
});

test('jumps', function (t) {
  t.test('jump', function (assert) {
    var parsed = hrm.parse(" jump a\t");
    assert.ok(parsed, 'can parse " jump a\t"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jump', 'is a JUMP statement');
    assert.equal(parsed.statements[0].label, 'a', 'has the expected label');

    assert.end();
  });

  t.test('jumpz', function (assert) {
    var parsed = hrm.parse(" jumpz ABC123");
    assert.ok(parsed, 'can parse " jumpz ABC123"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jumpz', 'is a JUMPZ statement');
    assert.equal(parsed.statements[0].label, 'ABC123', 'has the expected label');

    assert.end();
  });

  t.test('jumpn', function (assert) {
    var parsed = hrm.parse("\n\n\n\n\njumpn                ZZZZZ");
    assert.ok(parsed, 'can parse "jumpn                ZZZZZ"');
    assert.equal(parsed.statements.length, 1, 'has 1 statement(s)');
    assert.equal(parsed.statements[0].type, 'jumpn', 'is a JUMPN statement');
    assert.equal(parsed.statements[0].label, 'ZZZZZ', 'has the expected label');

    assert.end();
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
