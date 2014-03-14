/*
 * grunt-mysql-migrate
 * https://github.com/q-nick/grunt-mysql-migrate
 *
 * Copyright (c) 2014 Q-nick
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('mysql_migrate', 'Grunt plugin for mysql datasbe migrate through many databses', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    console.log(options);

};
