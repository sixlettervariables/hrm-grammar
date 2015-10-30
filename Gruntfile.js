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
      dest: "build/hrm-strict.js"
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-peg');

grunt.registerTask('grammar', ['peg']);
grunt.registerTask('default', ['peg', 'jshint']);
