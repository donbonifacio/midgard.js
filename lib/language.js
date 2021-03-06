(function language() {

  var _ = require('underscore');
  var path = require('path');
  var collection = {};
  var language = exports;

  exports.init = function init(midgard) {
    language.midgard = midgard;
    language.defaultLanguage = "en";
    language.supportedLanguages = [];
    return language;
  };

  exports.getTokens = function getTokens(lang) {
    return collection[lang];
  };

  exports.setDefaultLanguage = function setDefaultLanguage(lang) {
    language.defaultLanguage = lang;
  };

  exports.getSupportedLanguage = function getSupportedLanguage(lang) {
    if(collection[lang]) {
      return lang;
    }
    return language.defaultLanguage;
  };

  exports.load = function loadFile(fileName) {
    var source = require(path.join(language.midgard.appPath, fileName));
    var targetLanguage = source.language;
    if(!targetLanguage) {
      throw new Error("Please provide a language entry");
    }
    collection[targetLanguage] = collection[targetLanguage] || {};
    language.midgard.logger.midgard.loadedLanguage(source, fileName);
    _.extend(collection[targetLanguage], source);

    language.supportedLanguages.push(source.language);
  };

  exports.translate = function translate(lang, token, defaultText) {
    if(!lang) {
      throw new Error("Language not provided");
    }
    var langResources = collection[lang];
    if(langResources) {
      var translated = langResources[token];
      if(translated) {
        return translated;
      }
    }
    return defaultText || "{"+token+"}";
  };

  exports.getLanguageFromRequest = function getLanguageFromRequest(request) {
    var raw = request.headers["accept-language"];
    if(raw) {
      var parts = raw.split(';');
      var languages = parts[0].split(',');
      _.each(languages, function(language) {
        if(collection[language]) {
          return language;
        }
      });
    }
    return language.defaultLanguage;
  };

})();
