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
      return $('[data-trigger=recalc]', this.container).on('change keyup', function() {
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
      try {
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body'
        });
      } catch (_error) {}
      return root.WorkspaceComponent.activate();
    };

    return AppController;

  })();

  jQuery(function() {
    return new root.AppController.activate();
  });

}).call(this);

(function() {
  var root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.LM317VoltageWorkspace = (function(_super) {
    __extends(LM317VoltageWorkspace, _super);

    function LM317VoltageWorkspace() {
      return LM317VoltageWorkspace.__super__.constructor.apply(this, arguments);
    }

    LM317VoltageWorkspace.calculated = null;

    LM317VoltageWorkspace.prototype.recalc = function(element) {
      var r1, r2, result, vout;
      vout = parseFloat($('#vout', this.container).val());
      r1 = parseFloat($('#r1', this.container).val());
      r2 = parseFloat($('#r2', this.container).val());
      result = this.calculateNewValues(vout, r1, r2);
      $('#vout', this.container).val(result.vout || '');
      $('#r1', this.container).val(result.r1 || '');
      $('#r2', this.container).val(result.r2 || '');
      if (!result.vout && !result.r1 && !result.r2) {
        this.clearCalculated();
      }
      if (this.calculated) {
        $('#' + this.calculated, this.container).attr('disabled', true);
      }
      return true;
    };

    LM317VoltageWorkspace.prototype.determineResultElement = function(vout, r1, r2) {
      var result;
      if (vout && r1 && !r2) {
        result = 'r2';
      }
      if (vout && !r1 && r2) {
        result || (result = 'r1');
      }
      if (!vout && r1 && r2) {
        result || (result = 'vout');
      }
      return result;
    };

    LM317VoltageWorkspace.prototype.calculateNewValues = function(vout, r1, r2) {
      var new_r1, new_r2, new_vout;
      this.calculated || (this.calculated = this.determineResultElement(vout, r1, r2));
      new_vout = vout;
      new_r1 = r1;
      new_r2 = r2;
      if (this.calculated === 'r1') {
        new_r1 = new_r2 / (new_vout / 1.25 - 1);
      }
      if (this.calculated === 'r2') {
        new_r2 = new_r1 * (new_vout / 1.25 - 1);
      }
      if (this.calculated === 'vout') {
        new_vout = 1.25 * (1 + new_r2 / new_r1);
      }
      return {
        vout: new_vout,
        r1: new_r1,
        r2: new_r2
      };
    };

    LM317VoltageWorkspace.prototype.clear = function() {
      $('#vout', this.container).val('');
      $('#r1', this.container).val('');
      $('#r2', this.container).val('');
      return this.clearCalculated();
    };

    LM317VoltageWorkspace.prototype.clearCalculated = function() {
      this.calculated = null;
      return $('[data-trigger=recalc]', this.container).attr('disabled', false);
    };

    LM317VoltageWorkspace.prototype.bodyTitle = function() {
      return "LM317 Voltage Calculator";
    };

    LM317VoltageWorkspace.prototype.bodyTemplate = function() {
      return "<p>\n  Enter any two values to calculate the other...\n</p>\n<form class=\"form-inline\">\n  <div class=\"form-group\">\n    <label for=\"voltage\" class=\"control-label\">Vout</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"vout\" placeholder=\"volts\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"current\" class=\"control-label\">= 1.25 * ( R2</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"r2\" placeholder=\"&Omega;\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"resistance\" class=\"control-label\">/R1 )</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"r1\" placeholder=\"&Omega;\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <button class=\"btn btn-default\" data-action=\"clear\">Clear..</button>\n  </div>\n</form>";
    };

    LM317VoltageWorkspace.prototype.references = function() {
      return [
        {
          href: 'http://www.futurlec.com/Linear/LM317T.shtml',
          name: "LM317 Datasheet"
        }, {
          href: 'https://github.com/tardate/LittleArduinoProjects/tree/master/Electronics101/Power317',
          name: "Sample LM317 Arduino Project"
        }
      ];
    };

    return LM317VoltageWorkspace;

  })(root.WorkspaceComponent);

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

    OhmsLawWorkspace.calculated = null;

    OhmsLawWorkspace.prototype.recalc = function(element) {
      var current, resistance, result, voltage;
      voltage = parseFloat($('#voltage', this.container).val());
      current = parseFloat($('#current', this.container).val());
      resistance = parseFloat($('#resistance', this.container).val());
      result = this.calculateNewValues(voltage, current, resistance);
      $('#voltage', this.container).val(result.voltage || '');
      $('#current', this.container).val(result.current || '');
      $('#resistance', this.container).val(result.resistance || '');
      if (!result.voltage && !result.current && !result.resistance) {
        this.clearCalculated();
      }
      if (this.calculated) {
        $('#' + this.calculated, this.container).attr('disabled', true);
      }
      return true;
    };

    OhmsLawWorkspace.prototype.determineResultElement = function(voltage, current, resistance) {
      var result;
      if (voltage && current && !resistance) {
        result = 'resistance';
      }
      if (voltage && !current && resistance) {
        result || (result = 'current');
      }
      if (!voltage && current && resistance) {
        result || (result = 'voltage');
      }
      return result;
    };

    OhmsLawWorkspace.prototype.calculateNewValues = function(voltage, current, resistance) {
      this.calculated || (this.calculated = this.determineResultElement(voltage, current, resistance));
      if (this.calculated === 'voltage') {
        voltage = current * resistance;
      }
      if (this.calculated === 'current') {
        current = voltage / resistance;
      }
      if (this.calculated === 'resistance') {
        resistance = voltage / current;
      }
      return {
        voltage: voltage,
        current: current,
        resistance: resistance
      };
    };

    OhmsLawWorkspace.prototype.clear = function() {
      $('#voltage', this.container).val('');
      $('#current', this.container).val('');
      $('#resistance', this.container).val('');
      return this.clearCalculated();
    };

    OhmsLawWorkspace.prototype.clearCalculated = function() {
      this.calculated = null;
      return $('[data-trigger=recalc]', this.container).attr('disabled', false);
    };

    OhmsLawWorkspace.prototype.bodyTitle = function() {
      return "Ohm's Law Calculator";
    };

    OhmsLawWorkspace.prototype.bodyTemplate = function() {
      return "<p>\n  Enter any two values to calculate the other...\n</p>\n<form class=\"form-inline\">\n  <div class=\"form-group\">\n    <label for=\"voltage\" class=\"control-label\">V</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"voltage\" placeholder=\"volts\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"current\" class=\"control-label\">= i</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"current\" placeholder=\"amps\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"resistance\" class=\"control-label\">x R</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"resistance\" placeholder=\"&Omega;\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <button class=\"btn btn-default\" data-action=\"clear\">Clear..</button>\n  </div>\n</form>";
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
