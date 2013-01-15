(function validator() {

  var validator = exports;

  validator.present = function present(errors, obj, prop) {
    var data = obj[prop];
    if( !(data !== null && data !== undefined && data !== '') ) {
      errors.push({ field: prop, error: "NotPresent" });
    }
  };

  validator.string = function string(errors, obj, prop) {
    if( typeof(obj[prop]) !== "string" ) {
      errors.push({ field: prop, error: "NotString" });
    }
  };

  validator.boolean = function boolean(errors, obj, prop) {
    if( typeof(obj[prop]) !== "boolean" ) {
      errors.push({ field: prop, error: "NotBoolean" });
    }
  };

  validator.stringPresent = function stringPresent(errors, obj, prop) {
    validator.present(errors, obj, prop);
    validator.string(errors, obj, prop);
  };

})();
