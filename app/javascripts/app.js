(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.WebEncoder = (function() {
    function WebEncoder(container) {
      var instance;
      this.container = container;
      this.outElement = $('#outText', this.container);
      this.inElement = $('#inText', this.container);
      instance = this;
      $('[data-action]', this.container).on('click', function(e) {
        var action;
        e.preventDefault();
        action = $(this).data('action');
        return instance[action]();
      });
    }

    WebEncoder.prototype.htmlEncode = function() {
      return this.outElement.val($("<div></div>").text(this.inElement.val()).html());
    };

    WebEncoder.prototype.encodeURI = function() {
      return this.outElement.val(encodeURI(this.inElement.val()));
    };

    WebEncoder.prototype.encodeURIComponent = function() {
      return this.outElement.val(encodeURIComponent(this.inElement.val()));
    };

    WebEncoder.prototype.uriEscape = function() {
      return this.outElement.val(escape(this.inElement.val()));
    };

    return WebEncoder;

  })();

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.AppController = (function() {
    function AppController() {}

    AppController.activate = function() {
      return new WebEncoder($('form#webEncoder'));
    };

    return AppController;

  })();

  jQuery(function() {
    return new root.AppController.activate();
  });

}).call(this);

(function() {


}).call(this);
