/*
 * grunt-mysql-migrate
 * https://github.com/q-nick/grunt-mysql-migrate
 *
 * Copyright (c) 2014 Q-nick
 * Licensed under the MIT license.
 */

'use strict';

var shell = require('shelljs');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('mysql_migrate', 'Grunt plugin for mysql database migrate through many databses', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();

        var config = {
            host: options.host,
            user: options.user,
            pass: options.password,
            database:   options.db
        };
        if(config.push === true )
            db_push(config, options.path);
        else
            db_dump(config, options.path);
    });

    /*
     * Dumps a MYSQL database to a suitable backup location
     */
    var db_dump = function(config, path) {

        var cmd;

        // 2) Compile MYSQL cmd via Lo-Dash template string
        var tpl_mysqldump = grunt.template.process(tpls.mysqldump, {data: config});

        // 3) Test if requires remote access via SSH
        if (typeof config.ssh_host === "undefined") 
        { 
            cmd = tpl_mysqldump;
        } 
        else 
        { // it's a ssh connection
            var tpl_ssh = grunt.template.process(tpls.ssh, {data: {host: config.ssh_host} });
            grunt.log.writeln("over SSH");
            cmd = tpl_ssh + " \\ " + tpl_mysqldump;
        }
        grunt.log.writeln("Creating DUMP of "+ config.database);

        // Capture output...
        var output = shell.exec(cmd, {silent: true}).output;

        // Write output to file using native Grunt methods
        grunt.file.write( path, output );
        
        grunt.log.oklns("Database DUMP succesfully exported to: " + path);
    };
    /*
     * Imports a .sql file into the DB provided
     */
    function db_push(config, path) {

        var cmd;

        // 1) Create cmd string from Lo-Dash template
        var tpl_mysql = grunt.template.process(tpls.mysql, {data: config});

        // 2) Test whether target MYSQL DB is local or whether requires remote access via SSH
        if (typeof config.ssh_host === "undefined") 
        {
            cmd = tpl_mysql + " < " + path;
        } 
        else 
        { // it's a remote connection
            var tpl_ssh = grunt.template.process(tpls.ssh, {data: {host: config.ssh_host } });
            grunt.log.writeln("over SSH");
            cmd = tpl_ssh + " '" + tpl_mysql + "' < " + path;
        }
        grunt.log.writeln("Pushing "+config.databse+" to server");
            
        // Execute cmd
        shell.exec(cmd);

        grunt.log.oklns("Database "+config.databse+" pushed succesfully");
    }

    var tpls = {

        backup_path: "<%= backups_dir %>/<%= env %>/<%= date %>/<%= time %>",

        search_replace: "sed -i \"s#\<%= search %>#<%= replace %>#g\" <%= path %>",

        mysqldump: "mysqldump -h <%= host %> -u<%= user %> -p<%= pass %> <%= database %>",

        mysql: "mysql -h <%= host %> -u <%= user %> -p<%= pass %> <%= database %>",

        ssh: "ssh <%= host %>",
    };
};