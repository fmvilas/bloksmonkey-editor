var BloksMonkey = require('../../core/core');
var assert = require('assert');
var $ = require('jquery');
var is = require('is_js');
var ls = require('local-storage');
var _ = require('underscore');
var Q = require('q');
var UserCollection = require('../../collections/user');
var Project = {};
var ProjectStatic = {};

var PROJECT_LIST = 'Project.list([options]): ';
var PROJECT_GET = 'Project.get(options): ';
var PROJECT_OPEN = 'Project.open(options): ';
var PROJECT_MEMBERS = 'Project.members(options): ';
var PROJECT_FILES_LIST = 'Project.files.list(options): ';
var ERROR_LIST_OPTIONS = 'If specified, parameter options must be an object.';
var ERROR_OPTIONS_REQUIRED = 'Parameter options is required and should be an object.';
var ERROR_ID_SHOULD_BE_STRING = 'Parameter options.project_id should be a string.';
var ERROR_PROJECT_ID = 'Invalid options.project_id parameter.';

ProjectStatic.errors = {};
ProjectStatic.errors.LIST_OPTIONS = ERROR_LIST_OPTIONS;
ProjectStatic.errors.OPTIONS_REQUIRED = ERROR_OPTIONS_REQUIRED;
ProjectStatic.errors.ID_SHOULD_BE_STRING = ERROR_ID_SHOULD_BE_STRING;

function validateProjectId (pid) {
  return !!pid.match(/^[a-z0-9]{24}$/);
}

Project.Model = require('../../models/project');
Project.Collection = require('../../collections/project');
Project.FileModel = require('../../models/file');
Project.FileCollection = require('../../collections/file');

Project.files = {};

/**
 * Returns a list of projects.
 *
 * @param {Object} [options] Options to pass to the API call.
 * @returns {Promise}
 */
Project.list = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options) || is.undefined(options), PROJECT_LIST + ERROR_LIST_OPTIONS);

      options = options || {};
      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/projects',
      type: 'GET',
      data: options.query,
      crossDomain: true
    }).done(function (projects) {
      var projectsCollection = new Project.Collection(projects);
      resolve({ projects: projectsCollection, options: options });
      BloksMonkey.events.trigger('api.project.list', { projects: projectsCollection, options: options });
    }).fail(function (err) {
      err.message = PROJECT_LIST + 'Couldn\'t retrieve project list: ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

/**
 * Returns project information.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.project_id The id of the project you want to retrieve information.
 * @returns {Promise}
 */
Project.get = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), PROJECT_GET + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.project_id), PROJECT_GET + ERROR_ID_SHOULD_BE_STRING);
      assert(validateProjectId(options.project_id), PROJECT_GET + ERROR_PROJECT_ID);

      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      return reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/projects/' + options.project_id,
      type: 'GET',
      data: options.query,
      crossDomain: true
    }).done(function (project) {
      var projectModel = new Project.Model(project);
      resolve({ project: projectModel, options: options });
      BloksMonkey.events.trigger('api.project.get', { project: projectModel, options: options });
    }).fail(function (err) {
      err.message = PROJECT_GET + 'Couldn\'t get members on project with id "' + options.project_id + '": ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

/**
 * Returns project members.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.project_id The id of the project you want to retrieve information.
 * @param {Boolean} [options.include_owner] Wether to include the owner of the project or not.
 * @returns {Promise}
 */
Project.members = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), PROJECT_MEMBERS + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.project_id), PROJECT_MEMBERS + ERROR_ID_SHOULD_BE_STRING);
      assert(validateProjectId(options.project_id), PROJECT_MEMBERS + ERROR_PROJECT_ID);

      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      return reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/projects/' + options.project_id + '/members',
      type: 'GET',
      data: options.query,
      crossDomain: true
    }).done(function (members) {
      var userCollection = new UserCollection(members);
      resolve({ members: userCollection, options: options });
      BloksMonkey.events.trigger('api.project.member.list', { members: userCollection, options: options });
    }).fail(function (err) {
      err.message = PROJECT_MEMBERS + 'Couldn\'t get members on project with id "' + options.project_id + '": ' + err.message;
      reject({ error: err, options: options });
    });
  });
};


/**
 * Returns an collection of files for the given project.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.project_id The id of the project you want to retrieve information.
 * @returns {Promise}
 */
Project.files.list = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), PROJECT_FILES_LIST + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.project_id), PROJECT_FILES_LIST + ERROR_ID_SHOULD_BE_STRING);
      assert(validateProjectId(options.project_id), PROJECT_FILES_LIST + ERROR_PROJECT_ID);

      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
      options.query.project_id = options.project_id;
    } catch(err) {
      return reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/files',
      type: 'GET',
      crossDomain: true,
      data: options.query
    }).done(function (files) {
      var filesCollection = new Project.FileCollection(files);
      resolve({ files: filesCollection, options: options });
      BloksMonkey.events.trigger('api.project.files.list', { files: filesCollection, options: options });
    }).fail(function (err) {
      err.message = PROJECT_FILES_LIST + 'Couldn\'t get files on project with id "' + options.project_id + '": ' + err.message;
      reject({ error: err, options: options });
    });
  });
};



/**
 * Open a project.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.project_id The id of the project you want to retrieve information.
 * @returns {Promise}
 */
Project.open = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), PROJECT_OPEN + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.project_id), PROJECT_OPEN + ERROR_ID_SHOULD_BE_STRING);
      assert(validateProjectId(options.project_id), PROJECT_OPEN + ERROR_PROJECT_ID);
    } catch(err) {
      return reject({ error: err, options: options });
    }

    Project.get({ project_id: options.project_id })
    .done(function (data) {
      ProjectStatic.current = data.project;
      resolve({ project: ProjectStatic.current, options: options });
      BloksMonkey.events.trigger('api.project.open', { project: ProjectStatic.current, options: options });
    })
    .fail(function (err) {
      err.message = PROJECT_OPEN + 'Unable to open project: ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

/**
 * Returns the current open project
 *
 * @returns {Project} The current open project.
 */
Project.getCurrent = function () {
  return ProjectStatic.current;
};

/**
 * Close current project.
 */
Project.close = function () {
  ProjectStatic.current = null;
  BloksMonkey.event.trigger('api.project.close');
};

module.exports = Project;
