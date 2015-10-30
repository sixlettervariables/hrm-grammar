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

var util = require('util');

var Inbox = function (location) {
  if (!(this instanceof Inbox)) {
    return new Inbox(location);
  }

  this.type = 'inbox';
  this._location = location;
};

var Outbox = function (location) {
  if (!(this instanceof Outbox)) {
    return new Outbox(location);
  }

  this.type = 'outbox';
  this._location = location;
};

var Copyfrom = function (location, arg) {
  if (!(this instanceof Copyfrom)) {
    return new Copyfrom(location, arg);
  }

  this.type = 'copyfrom';
  this.arg = arg;
  this._location = location;
};

var Copyto = function (location, arg) {
  if (!(this instanceof Copyto)) {
    return new Copyto(location, arg);
  }

  this.type = 'copyto';
  this.arg = arg;
  this._location = location;
};

var Add = function (location, arg) {
  if (!(this instanceof Add)) {
    return new Add(location, arg);
  }

  this.type = 'add';
  this.arg = arg;
  this._location = location;
};

var Sub = function (location, arg) {
  if (!(this instanceof Sub)) {
    return new Sub(location, arg);
  }

  this.type = 'sub';
  this.arg = arg;
  this._location = location;
};

var Bumpup = function (location, arg) {
  if (!(this instanceof Bumpup)) {
    return new Bumpup(location, arg);
  }

  this.type = 'bumpup';
  this.arg = arg;
  this._location = location;
};

var Bumpdn = function (location, arg) {
  if (!(this instanceof Bumpdn)) {
    return new Bumpdn(location, arg);
  }

  this.type = 'bumpdn';
  this.arg = arg;
  this._location = location;
};

var Jump = function (location, label) {
  if (!(this instanceof Jump)) {
    return new Jump(location, label);
  }

  this.type = 'jump';
  this.label = label;
  this._location = location;
};

var Jumpz = function (location, label) {
  if (!(this instanceof Jumpz)) {
    return new Jumpz(location, label);
  }

  this.type = 'jumpz';
  this.label = label;
  this._location = location;
};

var Jumpn = function (location, label) {
  if (!(this instanceof Jumpn)) {
    return new Jumpn(location, label);
  }

  this.type = 'jumpn';
  this.label = label;
  this._location = location;
};

var Comment = function (location, ref) {
  if (!(this instanceof Comment)) {
    return new Comment(location, ref);
  }

  this.type = 'comment';
  this.ref = ref;
  this._location = location;
};

var Define = function (location, what, ref, data) {
  if (!(this instanceof Define)) {
    return new Define(location, what, ref, data);
  }

  this.type = 'define';
  this.what = what;
  this.ref = ref;
  this.data = data;
  this._location = location;
};

var Label = function (location, label) {
  if (!(this instanceof Label)) {
    return new Label(location, label);
  }

  this.type = 'label';
  this.label = label;
  this._location = location;
};

module.exports = {
  Inbox: Inbox,
  Outbox: Outbox,
  Copyfrom: Copyfrom,
  Copyto: Copyto,
  Add: Add,
  Sub: Sub,
  Bumpup: Bumpup,
  Bumpdn: Bumpdn,
  Jump: Jump,
  Jumpz: Jumpz,
  Jumpn: Jumpn,
  Comment: Comment,
  Define: Define,
  Label: Label
};
