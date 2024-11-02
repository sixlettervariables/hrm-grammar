/** Human Resource Machine Grammar
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
 *
 * ===========================================================================
 *
 * Based on the JavaScript grammar from PEG.js' examples [1]. Probably going to
 * be some issues and could use some love.
 *
 * [1] https://github.com/pegjs/pegjs/blob/master/examples/javascript.pegjs
 */
{
  var thisParser = this;

  var commands = require('../lib/hrm-commands.js');
  var validator = require('../lib/validator.js')(this.hrm$options);
  var pegutils = require('../lib/pegutils.js');
}

Start
 = program:Program { return program; }

Program
 = __ body:Lines? __ {
   var statements = pegutils.optionalList(body);
   return new commands.Program(statements);
 }

Lines
 = __ head:Line tail:(__ Line)* {
   return pegutils.buildList(head, tail, 1);
 }

Line
 = _ s:Statement _ { return s; }

Statement
 = UnterminatedStatement
 / s:TerminatedStatement _ Comment? (LineTerminatorSequence / EOF) {
   return s;
 }

UnterminatedStatement
 = LabelStatement
 / NoArgStatement

TerminatedStatement
 = LabeledJumpStatement
 / OneArgStatement
 / DefineStatement
 / CommentStatement

NoArgStatement
 = InboxStatement
 / OutboxStatement

OneArgStatement
 = AddStatement
 / SubStatement
 / BumpupStatement
 / BumpdnStatement
 / CopytoStatement
 / CopyfromStatement

LabeledJumpStatement
 = JumpzStatement
 / JumpnStatement
 / JumpStatement

DefineStatement
 = DefineLabelStatement
 / DefineCommentStatement

LabelStatement "label statement"
 = !ReservedWord label:Label ":" {
   return new commands.Label(location(), label);
 }

Argument
 = DirectArgument
 / IndirectArgument

DirectArgument "argument"
 = a:Digit+ {
   var tile = a.join("");
   if (!validator.isValidTile(tile)) {
     error('Found tile "'+ tile +'", which is not supported by the level');
   }
   return {
     type: "Identifier",
     name: tile
   };
 }

IndirectArgument "indirect argument"
 = "[" __ a:Digit+ __ "]" {
   var tile = a.join("");
   if (!validator.canDereference()) {
     error('Found indirect addressing, mode not supported by the level');
   }
   else if (!validator.isValidTile(tile)) {
     error('Found tile "'+ tile +'", which is not supported by the level');
   }
   return {
     type: "IndirectIdentifier",
     name: tile
   };
 }

Label "label"
 = head:Letter tail:(Letter / Digit)* {
   var name = head + tail.join("");
   if (/(IN|OUT)BOX|COPY(FROM|TO)|ADD|SUB|BUMP(UP|DN)|JUMP(N|Z)?|DEFINE|LABEL|COMMENT/.test(name)) {
     error('Expected label, but keyword ' + name + ' found');
   }
   return name;
 }

InboxStatement "INBOX"
 = tkInbox {
   return new commands.Inbox(location());
 }

OutboxStatement "OUTBOX"
 = tkOutbox {
   return new commands.Outbox(location());
 }

AddStatement "ADD"
 = i:tkAdd __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Add(location(), arg);
 }

SubStatement "SUB"
 = i:tkSub __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Sub(location(), arg);
 }

BumpupStatement "BUMPUP"
 = i:tkBumpup __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Bumpup(location(), arg);
 }

BumpdnStatement "BUMPDN"
 = i:tkBumpdn __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Bumpdn(location(), arg);
 }

CopytoStatement "COPYTO"
 = i:tkCopyto __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Copyto(location(), arg);
 }

CopyfromStatement "COPYFROM"
 = i:tkCopyfrom __ arg:Argument {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Copyfrom(location(), arg);
 }

JumpStatement "JUMP"
 = i:tkJump __ label:Label {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Jump(location(), label);
 }

JumpzStatement "JUMPZ"
 = i:tkJumpz __ label:Label {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Jumpz(location(), label);
 }

JumpnStatement "JUMPN"
 = i:tkJumpn __ label:Label {
   if (validator.isBlacklisted(i)) {
    error('Found "' + i + '", instruction not allowed by level');
   }
   return new commands.Jumpn(location(), label);
 }

CommentStatement "COMMENT Reference"
 = tkComment __ ref:Digit+ {
   if (!validator.canComment()) {
     error('Found "COMMENT", statement not allowed by level');
   }
   return new commands.Comment(location(), ref.join(""));
 }

DefineLabelStatement "DEFINE LABEL"
 = tkDefine __ tkLabel __ ref:DirectArgument _ LineTerminatorSequence __ data:Base64Data {
   if (!validator.canLabelTiles()) {
     error('Found "DEFINE LABEL", statement not allowed by level');
   }
   return new commands.Define(location(), "label", ref.name, data);
 }

DefineCommentStatement "DEFINE COMMENT"
 = tkDefine __ tkComment __ ref:Digit+ _ LineTerminatorSequence __ data:Base64Data {
   if (!validator.canComment()) {
     error('Found "DEFINE COMMENT", statement not allowed by level');
   }
   return new commands.Define(location(), "comment", ref.join(""), data);
 }

Base64Data "base64"
 = b64:Base64 ";" {
  return b64;
 }

ReservedWord
  = tkInbox
  / tkOutbox
  / tkCopyfrom
  / tkCopyto
  / tkAdd
  / tkSub
  / tkBumpup
  / tkBumpdn
  / tkJump
  / tkJumpz
  / tkJumpn
  / tkDefine
  / tkComment
  / tkLabel

//
// Keywords
//

tkInbox     = "INBOX"
tkOutbox    = "OUTBOX"
tkCopyto    = "COPYTO"
tkCopyfrom  = "COPYFROM"
tkAdd       = "ADD"
tkSub       = "SUB"
tkBumpup    = "BUMPUP"
tkBumpdn    = "BUMPDN"
tkJump      = "JUMP"
tkJumpz     = "JUMPZ"
tkJumpn     = "JUMPN"
tkDefine    = "DEFINE"
tkComment   = "COMMENT"
tkLabel     = "LABEL"

//
// Basics
//

Digit
 = [0-9]

Letter
 = [a-zA-Z]

Base64
 = b64:[A-Za-z0-9+\/=\r\n\t ]+ {
   return b64.join("").replace(/[\r\n\t ]/g, '');
 }

Comment "comment"
 = "--" (!LineTerminator .)*

Ws "whitespace"
 = " "
 / "\t"

LineTerminator
 = [\r\n]

LineTerminatorSequence "end of line"
 = "\r\n"
 / "\n"

EOF
 = !.

_
 = (Ws)*

__
 = (Ws / Comment / LineTerminatorSequence)*
