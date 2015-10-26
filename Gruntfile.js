/** hrmsandbox */
var grunt = require('grunt');

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  jshint: {
    options: {
      browser: false,
      node: true,
    },
    all: ['Gruntfile.js', 'index.js', 'test/**/*.js']
  },
  peg: {
    options: { trackLineAndColumn: true },
    hrmstrict: {
      src: "grammars/hrm-strict.pegjs",
      dest: "lib/hrm-strict.js"
    },
    hrm: {
      src: "grammars/hrm.pegjs",
      dest: "lib/hrm-extended.js"
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-peg');

grunt.registerTask('grammar', ['peg']);
grunt.registerTask('default', ['peg', 'jshint']);
