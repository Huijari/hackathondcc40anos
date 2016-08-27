module.exports = function(grunt) {

  var srcPath = [
    'mobile/assets/js/configs/*.js',
    'mobile/assets/js/directives/*.js',
    'mobile/assets/js/services/*.js',
    'mobile/assets/js/controllers/*.js',
    'mobile/assets/js/**/*.js'
  ];

  var cssPath = [
    'mobile/assets/css/**/*.css'
  ];

  grunt.initConfig({
    concat: {
      options: {
        process:
          function(src, filepath) {
            return '\n' + '/* FILE: ' + filepath + ' */' + '\n' + src;
          }
      },
      dist:{
        src: srcPath,
        dest: 'mobile/assets/built/main.js'
      },
      css: {
        src: cssPath,
        dest: 'mobile/assets/built/styles.css'
      }
    },
    jshint: {
      all: ['Gruntfile.js', srcPath]
    },
    watch: {
      pivotal: {
        files: [srcPath, cssPath],
        tasks: ['jshint', 'concat', 'concat:css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat']);
};