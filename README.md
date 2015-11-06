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

### parser.parse(source)
Parses a Human Resource Machine assembly program given in `source`.

#### source {String}
**required** Source of a Human Resource Machine assembly program.

#### Returns
An Abstract Syntax Tree (AST) representing the program.

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
var program = hrm.parse(source);

console.dir(program.statements);
```
Output:
```javascript
[ { type: 'label',
    label: 'a',
    _location:
     { start: { offset: 100, line: 4, column: 1 },
       end: { offset: 102, line: 4, column: 3 } } },
  { type: 'copyfrom',
    arg: { type: 'Identifier', name: '9' },
    _location:
     { start: { offset: 107, line: 5, column: 5 },
       end: { offset: 117, line: 5, column: 15 } } },
  { type: 'copyto',
    arg: { type: 'Identifier', name: '4' },
    _location:
     { start: { offset: 122, line: 6, column: 5 },
       end: { offset: 132, line: 6, column: 15 } } },
  { type: 'inbox',
    _location:
     { start: { offset: 137, line: 7, column: 5 },
       end: { offset: 142, line: 7, column: 10 } } },
  { type: 'copyto',
    arg: { type: 'Identifier', name: '1' },
    _location:
     { start: { offset: 147, line: 8, column: 5 },
       end: { offset: 157, line: 8, column: 15 } } },
  { type: 'inbox',
    _location:
     { start: { offset: 162, line: 9, column: 5 },
       end: { offset: 167, line: 9, column: 10 } } },
  { type: 'copyto',
    arg: { type: 'Identifier', name: '0' },
    _location:
     { start: { offset: 172, line: 10, column: 5 },
       end: { offset: 182, line: 10, column: 15 } } },
  { type: 'label',
    label: 'b',
    _location:
     { start: { offset: 183, line: 11, column: 1 },
       end: { offset: 185, line: 11, column: 3 } } },
  { type: 'jumpz',
    label: 'c',
    _location:
     { start: { offset: 190, line: 12, column: 5 },
       end: { offset: 200, line: 12, column: 15 } } },
  { type: 'copyfrom',
    arg: { type: 'IndirectIdentifier', name: '4' },
    _location:
     { start: { offset: 205, line: 13, column: 5 },
       end: { offset: 217, line: 13, column: 17 } } },
  { type: 'add',
    arg: { type: 'Identifier', name: '1' },
    _location:
     { start: { offset: 222, line: 14, column: 5 },
       end: { offset: 232, line: 14, column: 15 } } },
  { type: 'copyto',
    arg: { type: 'Identifier', name: '4' },
    _location:
     { start: { offset: 237, line: 15, column: 5 },
       end: { offset: 247, line: 15, column: 15 } } },
  { type: 'bumpdn',
    arg: { type: 'Identifier', name: '0' },
    _location:
     { start: { offset: 252, line: 16, column: 5 },
       end: { offset: 262, line: 16, column: 15 } } },
  { type: 'jump',
    label: 'b',
    _location:
     { start: { offset: 267, line: 17, column: 5 },
       end: { offset: 277, line: 17, column: 15 } } },
  { type: 'label',
    label: 'c',
    _location:
     { start: { offset: 278, line: 18, column: 1 },
       end: { offset: 280, line: 18, column: 3 } } },
  { type: 'copyfrom',
    arg: { type: 'Identifier', name: '4' },
    _location:
     { start: { offset: 285, line: 19, column: 5 },
       end: { offset: 295, line: 19, column: 15 } } },
  { type: 'outbox',
    _location:
     { start: { offset: 300, line: 20, column: 5 },
       end: { offset: 306, line: 20, column: 11 } } },
  { type: 'jump',
    label: 'a',
    _location:
     { start: { offset: 311, line: 21, column: 5 },
       end: { offset: 321, line: 21, column: 15 } } },
  { type: 'define',
    what: 'label',
    ref: '0',
    data: 'eJxrYGBgaGD2LvvD0lW6iSOg8h1n3Sxjjv5lX9gj1hZxtC14wju7MVagv0JYRLCKW9xsKofEyUUcEpLrWCVTt7VLzN/kKtm2gEH6eedvmWu1X+UmVxcqhNSkqzzvTFF936+kVjV9gdr0NTM0c/cArWGYrH2tdrK2WucEnQ0T/hvNXl9sPnv9I9uA5fPt3Bcm2FnPuGO/MwOkjtP9sxmjV4B3rfeKmN/edTmf/cymbvR3nvcuoGvx+gDJdSA198LUdP1jvMt6YiPqeWOXtHPEf57EmhCxFiSnGjK5+kZESA1X3MmSY/EcJfuSGPLMUw/mgeQUc6/VLsh93jm56NxSED8xNyEcRDdXnCxxK/dewliptt2uKnePXVXdCcuao2cta3gvg91UxlLYXOFcsKu6Lie2bW/2lU6GvItdbUWTunL7rnX8mJrd+GfG+vofUzfV7Zy2vaZ0CkjPzsnfLX9PcnbaMvVoocH02etBYt1LOErsVxpNql7lvrBy9clF31dPXwMSd18m6g+iPfZKNhzaH9NkcTiivuBYU/7Ho3+yvh3emeGx90/WpZ2P2wR3FU702209g/GA+8Kfh47Of3OcY9G9M0fng/S2XGvKd7p+sqTlWtdihhsxG+xvhKw6fK1pbsu1+S22NzlKTO/szc65vzPjxrOdGdOe/8nyfAMJk1EwsgEAOoThbA',
    _location:
     { start: { offset: 324, line: 24, column: 1 },
       end: { offset: 1042, line: 33, column: 56 } } },
  { type: 'define',
    what: 'label',
    ref: '1',
    data: 'eJxbzMDA8IfFLN2Ywyxdgf9g3hLee82L+D5PUuY7uegh36119/gj6m8LCFZJCzblSwjtzLgsbJTiJa6XeEzCKOWw5J+sw5JHCxmkJ1fXSyu27ZbR67eSVdqyU1Zt+w/ZkFVGCtYz9BXnt+gqTa97rNpVGqZ1sqRPN6CyzUCx7ZDhzmlMRizzjxrEbDhqkLkT6AyGL2Z7s9dazm5cZfW6Z5XVzmnPrd0XznKYvuaMa+LmIx6Jm3f6zF5f6nd0vrH/kvadPkcLd/poxYH0xYSvMYyKcHedFilaeyOCZf60yIi1IPEfKSk6H9Lrcn6kyDabp9rPLknzXrI5LWaDfobeXpB8T+y58s64kyX2SSyFibn2ueeL9RLPluglguQsa44WmtVKNnypDVkF4hvWt7m8bHR3BbGj2g/mXevI7D7X3TTXt0dvL3ev+WGQeGhnXU5Pz/f0gxO2pO6ZZJa+bcrJkt+TEloZJq7p7e8unQJSM3tertGN+TyeIQsTwkUXXqoKXzC/5cIihjn8iyevBMl/XcNSuHmtWufXNWt6v67ZMnnz2h9TQeLma6xtTNbutQWxtxxpyv9zsC6n4YB97vG9ITXH98o2NxyIWGt2ZMUOg2Ovdz08/XrX7bNau26ee74dpP7wta5Sryvnyi9efN1z7lLdLO4rR+e7XvNeUn+Dd2nlLesZv29eq625eanq6+3XPSV3dk7beJdhztt7dbMWP+JYBNL/6NHJknlPYpqknvEunfGMIe/qc7P0Sy+2pAa+3Jnh83p+S/M7M7AbG96XWvz6eCuo4lNp2tbPTflbP4vW6n27t1Hn++Mtmj+Utqz4MXu99N9zS0FqG6+H+Kk/vOTD9P5eaN63RxH//8uGMhAJzD4rbQHRG+8ezEt/2JS/4DFDns1HSLyNAtIBAMUuOMA',
    _location:
     { start: { offset: 1044, line: 35, column: 1 },
       end: { offset: 1990, line: 47, column: 41 } } },
  { type: 'define',
    what: 'label',
    ref: '4',
    data: 'eJxLY2BgKOCMuVfAaX64iCNmwxZ2wRUVbO4LrVmd51mzXqr6x2yWXsEmG1rKHhH4keOafy5XROAaLtnQe/xN+bcFlrTHCmyYkMS3d6YaL8OcN1z2s4HGMbRI7pzGLNWU7yU+2Vdf8aADSOyq1s6MSE2GvFsak6vFte41X9JW63QzeN3zy+R1j4m5Vs9ay8dtr6zOlW8y35DUrfc6boKOUQpIn0EAi2huoLfU68AQBY3gFTFLQpryVwbp9a8M2jntXcC5pb+9vZc4eLHMb/Jc0u7gFVD5z+tkSamfddbKoNK0B6GlaSAzjsXvzDgWL9vMkKTVU5P8vr8y5XXP6ky9/rTs2Y2ZWd5l6zLqct5mfE5Znfk+EaT+SXNm7MvGzNj39e8Td1V/TnGsPFrIUjG7sbYqt6+01npGdqPzPKvJTXNTZpdOAakPXDRZPnDRIy3/xXrGExcJ+pxdfDCPa+nsxublGybsXWk06euaDROebnrcNndrRP2M7dPrQHp+TJYNjZl3zf/5xsm+Hnu73H/csrdXerzFXORFpv7Rt1oGDKNgFNAJAACvsa2M',
    _location:
     { start: { offset: 1992, line: 49, column: 1 },
       end: { offset: 2583, line: 57, column: 10 } } } ]
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
