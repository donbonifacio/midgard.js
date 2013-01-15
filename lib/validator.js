(function validator() {

  var validator = exports;

  validator.present = function present(obj) {
    return obj !== null && obj!== undefined && obj !== '';
  };

  validator.string = function string(obj) {
    return typeof(obj) === "String";
  };

})();
