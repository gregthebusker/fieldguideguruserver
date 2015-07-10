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
    less: {
      dist: {
        options: {
          paths: ['node_modules/**']
        },
        files: {
          "public/stylesheets/style.css": "less/index.less"
        }
      }
    },
    watch: {
      scripts: {
        files: ["react/**/*", "less/**/*"],
        tasks: ["browserify", "less"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask("build", ["browserify", "less"]);
};
