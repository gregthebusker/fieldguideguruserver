module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    'browserify': {
      dist: {
        files: {
          'public/js/index.js': 'react/main.jsx'
        },
        options: {
          transform: ["babelify"]
        }
      }
    },
    watch: {
      scripts: {
        files: "react/*",
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask("default", ["browserify"]);
};
