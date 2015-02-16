(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.WorkspaceComponent = (function() {
    WorkspaceComponent.activate = function() {
      var hash;
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
      if (hash = window.location.hash) {
        return eval('new ' + hash.replace('#', '') + 'Workspace()');
      } else {
        return new root.WorkspaceComponent();
      }
    };

    function WorkspaceComponent() {
      this.container = $('#workspace');
      this.drawWorkspace();
      this.initialiseContext();
      this.enableActions();
      this.enableRecalc();
    }

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

    WorkspaceComponent.prototype.initialiseContext = function() {
      window.location.hash = this.contextName();
      return this.applyParams();
    };

    WorkspaceComponent.prototype.applyParams = function() {
      var encoded_param, name, parts, value, _i, _len, _ref;
      _ref = window.location.search.replace('?', '').split('&');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        encoded_param = _ref[_i];
        parts = encoded_param.split('=');
        if (parts.length === 2) {
          name = decodeURIComponent(parts[0]);
          value = decodeURIComponent(parts[1]);
          $('[data-trigger=recalc]#' + name, this.container).val(value);
        }
      }
      return true;
    };

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
      $('[data-trigger=recalc]', this.container).on('change keyup', function() {
        instance.recalc(this);
        return true;
      });
      return instance.recalc();
    };

    WorkspaceComponent.prototype.updatePermalink = function() {
      var item, permalink, search, value, _i, _len, _ref;
      permalink = [];
      _ref = $('[data-trigger=recalc]', this.container);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item = $(item);
        value = item.val();
        if (value && !item.attr('disabled')) {
          permalink.push(item.attr('id') + '=' + encodeURIComponent(value));
        }
      }
      if (permalink.length > 0) {
        search = '?' + permalink.join('&');
        $('#workspace_permalink').attr('href', search + '#' + this.contextName()).show();
      } else {
        search = '';
        $('#workspace_permalink').hide();
      }
      return true;
    };

    WorkspaceComponent.prototype.recalc = function(element) {
      return this.updatePermalink();
    };

    WorkspaceComponent.prototype.contextName = function() {
      return '';
    };

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

    LM317VoltageWorkspace.prototype.contextName = function() {
      return 'LM317Voltage';
    };

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
      this.updatePermalink();
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
      return "<row>\n  <div class=\"col-md-6\">\n    <p>\n      Given\n      <strong>Vout = 1.25 * ( 1 + R2/R1 )</strong>, enter any two values to calculate the other...\n    </p>\n    <form class=\"form-horizontal\">\n      <div class=\"form-group\">\n        <label for=\"voltage\" class=\"control-label\">Vout</label>\n        <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"vout\" placeholder=\"1.2 to 37 volts\" autocomplete=\"off\">\n      </div>\n      <div class=\"form-group\">\n        <label for=\"resistance\" class=\"control-label\">R1</label>\n        <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"r1\" placeholder=\"100&Omega; to 1k&Omega;\" autocomplete=\"off\">\n      </div>\n      <div class=\"form-group\">\n        <label for=\"current\" class=\"control-label\">R2</label>\n        <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"r2\" placeholder=\"&Omega;\" autocomplete=\"off\">\n      </div>\n      <div class=\"form-group\">\n        <button class=\"btn btn-default\" data-action=\"clear\">Clear..</button>\n      </div>\n    </form>\n  </div>\n  <div class=\"col-md-6\">\n    <h4>Typcial Application</h4>\n    <p class=\"text-center\">\n      <img src=\"app/images/lm317_overview.png\" width=\"400\">\n    </p>\n  </div>\n</row>";
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

    OhmsLawWorkspace.prototype.contextName = function() {
      return 'OhmsLaw';
    };

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
      this.updatePermalink();
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

  root.Parser = (function() {
    Parser.tokenize = function(expression) {
      var length, p, token, tokens;
      tokens = [];
      length = expression.length;
      p = 0;
      token = "";
      while (p < length) {
        if (expression[p].match(/[\+\|\(\)]/)) {
          if (token) {
            tokens.push(token);
            token = "";
          }
          tokens.push(expression[p]);
        }
        if (expression[p].match(/[\d\.]/)) {
          token = token + expression[p];
        }
        p += 1;
      }
      if (token) {
        tokens.push(token);
      }
      return tokens;
    };

    function Parser(expression) {
      this.tokens = root.Parser.tokenize(expression);
    }

    Parser.prototype.peek = function() {
      return this.tokens[0] || null;
    };

    Parser.prototype.next = function() {
      if (this.tokens.length > 0) {
        return this.tokens.shift();
      } else {
        return null;
      }
    };

    Parser.prototype.result = function() {
      var peek, term;
      term = this.parse_term();
      while (1) {
        peek = this.peek();
        if (peek === "+" && this.next()) {
          term = term + this.parse_term();
        } else if (peek === null) {
          return term;
        } else {
          throw "malformed";
        }
      }
    };

    Parser.prototype.parse_term = function() {
      var factor, peek;
      factor = this.parse_factor();
      while (1) {
        peek = this.peek();
        if (peek === "|" && this.next()) {
          factor = 1.0 / (1.0 / factor + 1.0 / this.parse_factor());
        } else {
          return factor;
        }
      }
    };

    Parser.prototype.parse_factor = function() {
      var expr, next, p;
      if (this.peek() === "(" && this.next()) {
        expr = [];
        if (this.tokens.indexOf(")") === -1) {
          throw "incomplete brackets";
        }
        while ((next = this.next()) !== ")") {
          expr.push(next);
        }
        p = new Parser(expr);
        return p.result();
      } else if (!isNaN(parseFloat(this.peek()))) {
        return parseFloat(this.next());
      } else {
        throw "malformed expression";
      }
    };

    return Parser;

  })();

  root.ResistorCalculatorWorkspace = (function(_super) {
    __extends(ResistorCalculatorWorkspace, _super);

    function ResistorCalculatorWorkspace() {
      return ResistorCalculatorWorkspace.__super__.constructor.apply(this, arguments);
    }

    ResistorCalculatorWorkspace.calculated = null;

    ResistorCalculatorWorkspace.prototype.calculate = function(expression) {
      var parser, result;
      parser = new root.Parser(expression);
      result = parser.result();
      return result;
    };

    ResistorCalculatorWorkspace.prototype.contextName = function() {
      return 'ResistorCalculator';
    };

    ResistorCalculatorWorkspace.prototype.bodyTitle = function() {
      return "Series and Parallel Resistor Caclulator";
    };

    ResistorCalculatorWorkspace.prototype.bodyTemplate = function() {
      return "<p>\n  Enter the formula representing the resistor network. Separate parallel components with \"|\", and use () to group resistance values\n</p>\n<form class=\"form-horizontal\">\n  <div class=\"form-group\">\n    <label for=\"formula\" class=\"control-label\">Resistor network</label>\n    <input type=\"input\" class=\"form-control\" data-trigger=\"recalc\" id=\"formula\" placeholder=\"enter formula\" autocomplete=\"off\">\n  </div>\n  <div class=\"form-group\">\n    <button class=\"btn btn-default\" data-action=\"clear\">Clear..</button>\n  </div>\n</form>";
    };

    return ResistorCalculatorWorkspace;

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

    WebEncoderWorkspace.prototype.contextName = function() {
      return 'WebEncoder';
    };

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
      this.outElement.val($("<div></div>").text(this.inElement.val()).html());
      return this.recalc();
    };

    WebEncoderWorkspace.prototype.encodeURI = function() {
      this.outElement.val(encodeURI(this.inElement.val()));
      return this.recalc();
    };

    WebEncoderWorkspace.prototype.encodeURIComponent = function() {
      this.outElement.val(encodeURIComponent(this.inElement.val()));
      return this.recalc();
    };

    WebEncoderWorkspace.prototype.uriEscape = function() {
      this.outElement.val(escape(this.inElement.val()));
      return this.recalc();
    };

    WebEncoderWorkspace.prototype.clearBoth = function() {
      this.outElement.val('');
      this.inElement.val('').focus();
      return this.recalc();
    };

    return WebEncoderWorkspace;

  })(root.WorkspaceComponent);

}).call(this);
