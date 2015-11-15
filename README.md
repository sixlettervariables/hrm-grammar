# hrm-grammar
A Human Resource Machine Program grammar ([PEG.js](https://github.com/pegjs/pegjs)).

[![Build Status](https://travis-ci.org/sixlettervariables/hrm-grammar.svg)](https://travis-ci.org/sixlettervariables/hrm-grammar)
[![npm version](https://badge.fury.io/js/hrm-grammar.svg)](https://badge.fury.io/js/hrm-grammar)

## Getting Started
Include `hrm-grammar` in your project with npm:

```bash
$ npm install --save hrm-grammar
```
Then require it in your project:

```javascript
var hrm = require('hrm-grammar').parser;
var program = hrm.parse('-- HUMAN RESOURCE MACHINE PROGRAM --');
```

## Usage
`hrm-grammar` provides a parser (built on PEG.js) and a small library of
classes which support the AST.

## API
The `hrm-grammar` library has two exports: `parser` and `commands`.

### parser.parse(source [, options])
Parses a Human Resource Machine assembly program given in `source`. An `options`
object may be passed in to control parsing behavior.

#### source {String}
**required** Source of a Human Resource Machine assembly program.

#### options {Object}
*optional* Controls behavior during parsing.

#### options.level {Object}
An object which follows the [`hrm-level-data` level schema](https://github.com/atesgoral/hrm-level-data/blob/master/hrm-level-data-schema.json).

#### options.validateTiles {Boolean}
If `true`, the parser will throw `peg$SyntaxError` if a referenced tile cannot be addressed in the given `options.level`.

#### *Returns* {Object}
An parser result object representing the program. The object contains the following
properties:

##### statements {Array of Object}
An array of the `command` objects (labels and instructions, but not `COMMENT` or `DEFINE` statements).

##### labels {Array of Object}
An array of the labels used in the program.

##### labelMap {Map of Object}
A map of the labels used in the program.

##### unreferencedLabels {Map of Object}
An array of unreferenced labels, each being an object with two members: `label` and `referencedBy`. `label` is a String and is the verbatim label found in the instruction. `referencedBy` is the executable statement object which referenced the label.

##### comments {Array of Object}
An array of comment objects (i.e. `COMMENT` statements).

##### imageDefinitions {Array of Object}
An array of image definitions (i.e. `DEFINE COMMENT` and `DEFINE LABEL` statements).

##### \_ast {Array of Object}
The raw AST of all statement objects (labels, instructions, `COMMENT`, and `DEFINE`).

### commands {Array{Command}}
Contains all of the AST node types supported by `hrm-grammar`. There are six types of AST nodes:
- Commands (`inbox`, `outbox`)
- One Argument Commands (e.g. `add` or `bumpup`)
- Jump Commands
- Labels
- Comment Command
- Define Commands (`define comment`, `define label`)

Each AST node contains the relevant information for its command and its source location to help with contextual messages.

#### type {String} (All Commands)
Type of the AST node. May be one of:
- `inbox`
- `outbox`
- `copyto`
- `copyfrom`
- `add`
- `sub`
- `bumpup`
- `bumpdn`
- `jump`
- `jumpz`
- `jumpn`
- `comment`
- `define`
- `label`

#### \_location {Object} (All Commands)
Each AST node also includes its source location in `_location`:

- `Command._location.start` `{ line: {Number}, column: {Number} }`
- `Command._location.end` `{ line: {Number}, column: {Number} }`

#### arg {Argument} (One Argument Commands)
For one argument commands, like `copyto` or `bumpup`, the argument is described
by its type and name:

- `OneArgCommand.arg.type` `{String}`: Either `Identifier` or `IndirectIdentifier`
- `OneArgCommand.arg.name` `{String}`: The argument's name.

#### label {String} (Jump Commands)
For jump commands the label is given in the `label` member.

#### label {String} (Labels)
For labels, the label is given in the `label` member.

#### ref {String} (Comment Commands)
For comment commands its reference ID is given in `ref`.

#### what {String} (Define Commands)
For define commands, like `DEFINE COMMENT` and `DEFINE LABEL`, the type of the definition is given in `what`.

#### ref {String} (Define Commands)
For define commands the reference ID of the definition is given in `ref`.

#### data {String} (Define Commands)
For define commands the Base64 encoded data of the definition is given in `data`.

### Example

```javascript
var fs = require('fs');
var hrm = require('hrm-grammar').parser;

var source = fs.readFileSync('test/fixtures/syntax-1.hrm');
var program = hrm.parse(source.toString());

console.dir(program);
```
Output:

```javascript
{ statements:
   [ { type: 'label',
       label: 'a',
       _location: { start: [Object], end: [Object] } },
     { type: 'copyfrom',
       arg: { type: 'Identifier', name: '9' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 1 },
     { type: 'copyto',
       arg: { type: 'Identifier', name: '4' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 2 },
     { type: 'inbox',
       _location: { start: [Object], end: [Object] },
       lineNumber: 3 },
     { type: 'copyto',
       arg: { type: 'Identifier', name: '1' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 4 },
     { type: 'inbox',
       _location: { start: [Object], end: [Object] },
       lineNumber: 5 },
     { type: 'copyto',
       arg: { type: 'Identifier', name: '0' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 6 },
     { type: 'label',
       label: 'b',
       _location: { start: [Object], end: [Object] } },
     { type: 'jumpz',
       label: 'c',
       _location: { start: [Object], end: [Object] },
       lineNumber: 7 },
     { type: 'copyfrom',
       arg: { type: 'IndirectIdentifier', name: '4' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 8 },
     { type: 'add',
       arg: { type: 'Identifier', name: '1' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 9 },
     { type: 'copyto',
       arg: { type: 'Identifier', name: '4' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 10 },
     { type: 'bumpdn',
       arg: { type: 'Identifier', name: '0' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 11 },
     { type: 'jump',
       label: 'b',
       _location: { start: [Object], end: [Object] },
       lineNumber: 12 },
     { type: 'label',
       label: 'c',
       _location: { start: [Object], end: [Object] } },
     { type: 'copyfrom',
       arg: { type: 'Identifier', name: '4' },
       _location: { start: [Object], end: [Object] },
       lineNumber: 13 },
     { type: 'outbox',
       _location: { start: [Object], end: [Object] },
       lineNumber: 14 },
     { type: 'jump',
       label: 'a',
       _location: { start: [Object], end: [Object] },
       lineNumber: 15 } ],
  labels:
   [ { type: 'label',
       label: 'a',
       _location: { start: [Object], end: [Object] } },
     { type: 'label',
       label: 'b',
       _location: { start: [Object], end: [Object] } },
     { type: 'label',
       label: 'c',
       _location: { start: [Object], end: [Object] } } ],
  labelMap:
   { a:
      { type: 'label',
        label: 'a',
        _location: { start: [Object], end: [Object] } },
     b:
      { type: 'label',
        label: 'b',
        _location: { start: [Object], end: [Object] } },
     c:
      { type: 'label',
        label: 'c',
        _location: { start: [Object], end: [Object] } } },
  unreferencedLabels: [],
  comments: [],
  imageDefinitions:
   [ { type: 'define',
       what: 'label',
       ref: '0',
       data: 'eJxrYGBgaGD2LvvD0...',
       _location: { start: [Object], end: [Object] } },
     { type: 'define',
       what: 'label',
       ref: '1',
       data: 'eJxbzMDA8IfFLN2Yw...',
       _location: { start: [Object], end: [Object] } },
     { type: 'define',
       what: 'label',
       ref: '4',
       data: 'eJxLY2BgKOCMuVfAa...',
       _location: { start: [Object], end: [Object] } } ],
  _ast:
     [ { type: 'label',
         label: 'a',
         _location: { start: [Object], end: [Object] } },
       { type: 'copyfrom',
         arg: { type: 'Identifier', name: '9' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 1 },
       { type: 'copyto',
         arg: { type: 'Identifier', name: '4' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 2 },
       { type: 'inbox',
         _location: { start: [Object], end: [Object] },
         lineNumber: 3 },
       { type: 'copyto',
         arg: { type: 'Identifier', name: '1' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 4 },
       { type: 'inbox',
         _location: { start: [Object], end: [Object] },
         lineNumber: 5 },
       { type: 'copyto',
         arg: { type: 'Identifier', name: '0' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 6 },
       { type: 'label',
         label: 'b',
         _location: { start: [Object], end: [Object] } },
       { type: 'jumpz',
         label: 'c',
         _location: { start: [Object], end: [Object] },
         lineNumber: 7 },
       { type: 'copyfrom',
         arg: { type: 'IndirectIdentifier', name: '4' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 8 },
       { type: 'add',
         arg: { type: 'Identifier', name: '1' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 9 },
       { type: 'copyto',
         arg: { type: 'Identifier', name: '4' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 10 },
       { type: 'bumpdn',
         arg: { type: 'Identifier', name: '0' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 11 },
       { type: 'jump',
         label: 'b',
         _location: { start: [Object], end: [Object] },
         lineNumber: 12 },
       { type: 'label',
         label: 'c',
         _location: { start: [Object], end: [Object] } },
       { type: 'copyfrom',
         arg: { type: 'Identifier', name: '4' },
         _location: { start: [Object], end: [Object] },
         lineNumber: 13 },
       { type: 'outbox',
         _location: { start: [Object], end: [Object] },
         lineNumber: 14 },
       { type: 'jump',
         label: 'a',
         _location: { start: [Object], end: [Object] },
         lineNumber: 15 },
       { type: 'define',
         what: 'label',
         ref: '0',
         data: 'eJxrYGBgaGD2LvvD0...',
         _location: { start: [Object], end: [Object] } },
       { type: 'define',
         what: 'label',
         ref: '1',
         data: 'eJxbzMDA8IfFLN2Yw...',
         _location: { start: [Object], end: [Object] } },
       { type: 'define',
         what: 'label',
         ref: '4',
         data: 'eJxLY2BgKOCMuVfAa...',
         _location: { start: [Object], end: [Object] } } ] }
```

## Tests
`hrm-grammar` has a small suite of tests written against `tape` and run with
`tap`.

```bash
$ npm test
```

## Dependencies
`hrm-grammar` has no runtime dependencies.

## Development Dependencies
`hrm-grammar` uses `pegjs` and `grunt` as integral parts of the development
workflow. Both should be installed and available on your path.

```sh
$ npm install -g grunt-cli
$ npm install -g pegjs
```

## Contributing
All contributions to the project will be considered for inclusion, simply submit a pull request!

1. [Fork](https://github.com/sixlettervariables/hrm-grammar/fork) the repository ([read more detailed steps](https://help.github.com/articles/fork-a-repo)).
2. [Create a branch](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository#creating-a-branch)
3. Make and commit your changes
4. Push your changes back to your fork.
5. [Submit a pull request](https://github.com/sixlettervariables/hrm-grammar/compare/) ([read more detailed steps](https://help.github.com/articles/creating-a-pull-request)).

## License
`hrm-grammar` is licensed under the MIT License.

> The MIT License (MIT)
>
> Copyright (c) 2015 Christopher Watford
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
