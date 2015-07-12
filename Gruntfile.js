'user strict';

module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks('grunt-postcss');



  grunt.initConfig({
    'browserify': {
      dist: {
        options: {
          browserifyOptions: {
            entry: './react/main.js',
          },
          transform: [["babelify", { "stage": 1 }]],
          plugin: [
            ['remapify', [
              {
                src: 'react/**/*',
                filter: function(alias, dirname, basename) {
                  return basename.replace(/.js$/, '');
                }
              }
            ]]
          ],
        },
        files: {
          'public/js/index.js': 'react/main.js'
        },
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
        files: ["react/**/*"],
        tasks: ["browserify"]
      },
      styles: {
        files: ["less/**/*"],
        tasks: ["less"]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask("build", ["browserify", "less"]);
};
