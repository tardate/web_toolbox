(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.WorkspaceComponent = (function() {
    WorkspaceComponent.activate = function() {
      $('body').bind('workspace.activate', function(e, workspaceData) {
        return eval('new ' + workspaceData.name + '()');
      });
      $('body').on('click', '[data-workspace]', function(e) {
        var link, workspace_name;
        link = $(this);
        if (workspace_name = link.data('workspace')) {
          e.preventDefault();
          $('body').trigger('workspace.activate', {
            name: workspace_name
          });
          return true;
        }
      });
      return new root.WorkspaceComponent();
    };

    function WorkspaceComponent() {
      this.container = $('#workspace');
      this.drawWorkspace();
      this.enableActions();
      this.enableRecalc();
    }

    WorkspaceComponent.prototype.enableActions = function() {
      var instance;
      instance = this;
      return $('[data-action]', this.container).on('click', function(e) {
        var action;
        e.preventDefault();
        action = $(this).data('action');
        return instance[action]();
      });
    };

    WorkspaceComponent.prototype.enableRecalc = function() {
      var instance;
      instance = this;
      return $('[data-recalc]', this.container).on('change keyup', function() {
        instance.recalc(this);
        return true;
      });
    };

    WorkspaceComponent.prototype.drawWorkspace = function() {
      var a, ref_ul, reference, references, _i, _len;
      $('#workspace_title', this.container).text(this.bodyTitle());
      $('#workspace_content', this.container).html(this.bodyTemplate());
      ref_ul = $('#workspace_references ul.reflist', this.container);
      ref_ul.html('');
      if (references = this.references()) {
        for (_i = 0, _len = references.length; _i < _len; _i++) {
          reference = references[_i];
          a = $('<a></a>');
          a.attr('href', reference.href);
          a.text(reference.name);
          ref_ul.append($('<li></li>').append(a));
        }
        return $('#workspace_references', this.container).show();
      } else {
        return $('#workspace_references', this.container).hide();
      }
    };

    WorkspaceComponent.prototype.recalc = function(element) {};

    WorkspaceComponent.prototype.bodyTitle = function() {
      return "About The Toolbox";
    };

    WorkspaceComponent.prototype.bodyTemplate = function() {
      return "<p>\nA collection of my most frequently used tools and references for what is sparking my interest at the time.\n</p>\n<p>\nNecessarily a never-ending work-in-progress&mdash;this site is itself a reboot/reworking of stuff that came before&mdash;it also a bit of a playgound\nfor me to practice my minimalist javascripty/webby fu. So be forewarned! And have a good day ;-)\n</p>";
    };

    WorkspaceComponent.prototype.references = function() {
      return null;
    };

    return WorkspaceComponent;

  })();

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.AppController = (function() {
    function AppController() {}

    AppController.activate = function() {
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
      });
      return root.WorkspaceComponent.activate();
    };

    return AppController;

  })();

  jQuery(function() {
    return new root.AppController.activate();
  });

}).call(this);

(function() {


}).call(this);

(function() {
  var root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.OhmsLawWorkspace = (function(_super) {
    __extends(OhmsLawWorkspace, _super);

    function OhmsLawWorkspace() {
      return OhmsLawWorkspace.__super__.constructor.apply(this, arguments);
    }

    OhmsLawWorkspace.prototype.recalc = function(element) {
      var changing, i, new_i, new_r, new_v, r, v;
      changing = $(element).attr('id');
      if (!changing) {
        return;
      }
      v = parseFloat($('#voltage', this.container).val());
      i = parseFloat($('#current', this.container).val());
      r = parseFloat($('#resistance', this.container).val());
      if (changing === 'voltage') {
        new_v = v;
        new_i = i || new_v / r;
        new_r = new_v / new_i;
      }
      if (changing === 'current') {
        new_i = i;
        new_r = r || v / new_i;
        new_v = new_i * new_r;
      }
      if (changing === 'resistance') {
        new_r = r;
        new_i = i || v / new_r;
        new_v = new_i * new_r;
      }
      if (changing !== 'voltage') {
        $('#voltage', this.container).val(new_v || '');
      }
      if (changing !== 'current') {
        $('#current', this.container).val(new_i || '');
      }
      if (changing !== 'resistance') {
        $('#resistance', this.container).val(new_r || '');
      }
      return true;
    };

    OhmsLawWorkspace.prototype.clear = function() {
      $('#voltage', this.container).val('');
      $('#current', this.container).val('');
      return $('#resistance', this.container).val('');
    };

    OhmsLawWorkspace.prototype.bodyTitle = function() {
      return "Ohm's Law Calculator";
    };

    OhmsLawWorkspace.prototype.bodyTemplate = function() {
      return "<form class=\"form-inline\">\n  <div class=\"form-group\">\n    <label for=\"voltage\" class=\"control-label\">V</label>\n    <input type=\"input\" class=\"form-control\" data-recalc=\"trigger\" id=\"voltage\" placeholder=\"volts\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"current\" class=\"control-label\">= i</label>\n    <input type=\"input\" class=\"form-control\" data-recalc=\"trigger\" id=\"current\" placeholder=\"amps\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"resistance\" class=\"control-label\">x R</label>\n    <input type=\"input\" class=\"form-control\" data-recalc=\"trigger\" id=\"resistance\" placeholder=\"&Omega;\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <button class=\"btn btn-default\" data-action=\"clear\">Clear..</button>\n  </div>\n</form>";
    };

    OhmsLawWorkspace.prototype.references = function() {
      return [
        {
          href: 'http://en.wikipedia.org/wiki/Ohm%27s_law',
          name: "Ohm's law on Wikipedia"
        }
      ];
    };

    return OhmsLawWorkspace;

  })(root.WorkspaceComponent);

}).call(this);

(function() {
  var root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.WebEncoderWorkspace = (function(_super) {
    __extends(WebEncoderWorkspace, _super);

    function WebEncoderWorkspace() {
      WebEncoderWorkspace.__super__.constructor.apply(this, arguments);
      this.outElement = $('#outText', this.container);
      this.inElement = $('#inText', this.container);
    }

    WebEncoderWorkspace.prototype.bodyTitle = function() {
      return "HTML and URI Encoding";
    };

    WebEncoderWorkspace.prototype.bodyTemplate = function() {
      return "<form id=\"webEncoder\">\n  <div class=\"form-group\">\n    <label for=\"inText\">source</label>\n    <textarea id=\"inText\" class=\"form-control\" rows=6 wrap=\"off\" placeholder=\"enter your text, html or javaScript to convert here\"></textarea>\n  </div>\n  <div class=\"form-group\">\n    <button class=\"btn btn-default\" data-action=\"htmlEncode\">HTML Encode</button>\n    <button class=\"btn btn-default\" data-action=\"encodeURI\">URI Encode</button>\n    <button class=\"btn btn-default\" data-action=\"encodeURIComponent\">URI Encode Component</button>\n    <button class=\"btn btn-default\" data-action=\"uriEscape\">URI Escape</button>\n    <button class=\"btn btn-default\" data-action=\"clearBoth\">Clear..</button>\n  </div>\n  <div class=\"form-group\">\n    <label for=\"outText\">encoded output</label>\n    <textarea id=\"outText\" class=\"form-control\" rows=6 wrap=\"off\"></textarea>\n  </div>\n</form>";
    };

    WebEncoderWorkspace.prototype.references = function() {
      return [
        {
          href: 'http://old.stevenharman.net/blog/archive/2007/06/16/url-and-html-encoding-on-the-client-javascript-to-the.aspx',
          name: 'URL and HTML Encoding on the Client? JavaScript to the Rescue!'
        }, {
          href: 'http://xkr.us/articles/javascript/encode-compare/',
          name: 'Comparing escape(), encodeURI(), and encodeURIComponent()'
        }, {
          href: 'http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery',
          name: 'Escaping HTML strings with jQuery'
        }
      ];
    };

    WebEncoderWorkspace.prototype.htmlEncode = function() {
      return this.outElement.val($("<div></div>").text(this.inElement.val()).html());
    };

    WebEncoderWorkspace.prototype.encodeURI = function() {
      return this.outElement.val(encodeURI(this.inElement.val()));
    };

    WebEncoderWorkspace.prototype.encodeURIComponent = function() {
      return this.outElement.val(encodeURIComponent(this.inElement.val()));
    };

    WebEncoderWorkspace.prototype.uriEscape = function() {
      return this.outElement.val(escape(this.inElement.val()));
    };

    WebEncoderWorkspace.prototype.clearBoth = function() {
      this.outElement.val('');
      return this.inElement.val('').focus();
    };

    return WebEncoderWorkspace;

  })(root.WorkspaceComponent);

}).call(this);
