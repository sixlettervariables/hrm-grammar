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

module.exports = function (options) {
  var OPTIONS = options || {};
  var LEVEL = OPTIONS.level;
  return {
      options: OPTIONS,
      level: LEVEL,

      isBlacklisted: function (command) {
        if (this.level && this.level.commands) {
          return this.level.commands.indexOf(command) < 0;
        }
        return false;
      },

      isValidTile: function (tile) {
        if (this.options.validateTiles && this.level) {
          return this.level.floor &&
                 tile >= 0 &&
                 tile < (this.level.floor.columns * this.level.floor.rows);
        }
        return true;
      },

      canDereference: function () {
        return this.level === undefined ||
               this.level.dereferencing;
      },

      canComment: function () {
        return this.level === undefined ||
               this.level.comments;
      },

      canLabelTiles: function () {
        return this.level === undefined ||
               this.level.labels;
      }
  };
};
