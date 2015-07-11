module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    'browserify': {
      dist: {
        options: {
          transform: [["babelify", { "stage": 1 }]],
          plugin: [
            ['remapify', [
              {
                src: 'react/**/*',
                filter: function(alias, dirname, basename) {
                  return basename.replace(/.jsx?$/, '');
                }
              }
            ]]
          ],
        },
        files: {
          'public/js/index.js': 'react/main.jsx'
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
        files: ["react/**/*", "less/**/*"],
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
