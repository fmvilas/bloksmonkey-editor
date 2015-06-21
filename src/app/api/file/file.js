var BloksMonkey = require('../../core/core');
var assert = require('assert');
var $ = require('jquery');
var is = require('is_js');
var ls = require('local-storage');
var _ = require('underscore');
var Q = require('q');
var File = {};
var FileStatic = {};

var FILE_GET_CONTENT = 'File.content.get(options): ';
var FILE_GET = 'File.get(options): ';
var ERROR_OPTIONS_REQUIRED = 'Parameter options is required and should be an object.';
var ERROR_ID_SHOULD_BE_STRING = 'Parameter options.file_id should be a string.';
var ERROR_FILE_ID = 'Invalid options.file_id parameter.';

function validateFileId (fid) {
  return !!fid.match(/^[a-z0-9]{24}$/);
}

File.Model = require('../../models/file');
File.Collection = require('../../collections/file');

File.content = {};

/**
 * Returns file content.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.file_id The id of the file you want to retrieve content.
 * @returns {Promise}
 */
File.content.get = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), FILE_GET_CONTENT + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.file_id), FILE_GET_CONTENT + ERROR_ID_SHOULD_BE_STRING);
      assert(validateFileId(options.file_id), FILE_GET_CONTENT + ERROR_FILE_ID);

      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      return reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/files/' + options.file_id + '/content',
      type: 'GET',
      data: options.query,
      crossDomain: true
    }).done(function (file) {
      resolve({ content: file, options: options });
      BloksMonkey.events.trigger('api.file.content.get', { content: file, options: options });
    }).fail(function (err) {
      err.message = FILE_GET_CONTENT + 'Couldn\'t get content of file with id "' + options.file_id + '": ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

/**
 * Returns file information.
 *
 * @param {Object} options Options to pass to the API call.
 * @param {String} options.file_id The id of the file you want to retrieve content.
 * @returns {Promise}
 */
File.get = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options), FILE_GET + ERROR_OPTIONS_REQUIRED);
      assert(is.string(options.file_id), FILE_GET + ERROR_ID_SHOULD_BE_STRING);
      assert(validateFileId(options.file_id), FILE_GET + ERROR_FILE_ID);

      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      return reject({ error: err, options: options });
    }

    $.ajax({
      url: '/api/v1/files/' + options.file_id,
      type: 'GET',
      data: options.query,
      crossDomain: true
    }).done(function (file) {
      var fileModel = new File.Model(file);
      resolve({ file: fileModel, options: options });
      BloksMonkey.events.trigger('api.file.get', { file: fileModel, options: options });
    }).fail(function (err) {
      err.message = FILE_GET + 'Couldn\'t get file with id "' + options.file_id + '": ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

module.exports = File;
