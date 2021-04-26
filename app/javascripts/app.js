(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  // application controller - co-ordinates the marshalling of user input and rendering of the web page view
  root.AppController = class AppController {
    static activate() {
      try {
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body'
        });
      } catch (error) {}
      return root.WorkspaceComponent.activate();
    }

  };

  jQuery(function() {
    return root.AppController.activate();
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  // base class for something that operates in a common #workspace panel
  root.WorkspaceComponent = class WorkspaceComponent {
    // Command: activates workspace controller
    static activate() {
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
    }

    // Default constructor initialises the component attached to a common #workspace element
    // It expects two elements under #workspace:
    // #workspace_title: element that should contain title text
    // #workspace_content: element the component will render itself within
    constructor() {
      this.container = $('#workspace');
      this.drawWorkspace();
      this.initialiseContext();
      this.enableActions();
      this.enableRecalc();
    }

    drawWorkspace() {
      var a, i, len, ref_ul, reference, references;
      $('#workspace_title', this.container).text(this.bodyTitle());
      $('#workspace_content', this.container).html(this.bodyTemplate());
      ref_ul = $('#workspace_references ul.reflist', this.container);
      ref_ul.html('');
      if (references = this.references()) {
        for (i = 0, len = references.length; i < len; i++) {
          reference = references[i];
          a = $('<a></a>');
          a.attr('href', reference.href);
          a.text(reference.name);
          ref_ul.append($('<li></li>').append(a));
        }
        return $('#workspace_references', this.container).show();
      } else {
        return $('#workspace_references', this.container).hide();
      }
    }

    initialiseContext() {
      window.location.hash = this.contextName();
      return this.applyParams();
    }

    applyParams() {
      var encoded_param, i, len, name, parts, ref, value;
      ref = window.location.search.replace('?', '').split('&');
      for (i = 0, len = ref.length; i < len; i++) {
        encoded_param = ref[i];
        parts = encoded_param.split('=');
        if (parts.length === 2) {
          name = decodeURIComponent(parts[0]);
          value = decodeURIComponent(parts[1]);
          $('[data-trigger=recalc]#' + name, this.container).val(value);
        }
      }
      return true;
    }

    enableActions() {
      var instance;
      instance = this;
      return $('[data-action]', this.container).on('click', function(e) {
        var action;
        e.preventDefault();
        action = $(this).data('action');
        return instance[action]();
      });
    }

    enableRecalc() {
      var instance;
      instance = this;
      $('[data-trigger=recalc]', this.container).on('change keyup', function() {
        instance.recalc(this);
        return true;
      });
      return instance.recalc();
    }

    updatePermalink() {
      var i, item, len, permalink, ref, search, value;
      permalink = [];
      ref = $('[data-trigger=recalc]', this.container);
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
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
    }

    // override in subclasses to implement workspace-specific recalc
    recalc(element) {
      return this.updatePermalink();
    }

    // override in subclasses
    contextName() {
      return '';
    }

    // override in subclasses to define workspace-specific title
    bodyTitle() {
      return "About The Toolbox";
    }

    // override in subclasses to define workspace-specific body
    bodyTemplate() {
      // TODO: maybe switch to handlebars?
      return `<p>
A collection of my most frequently used tools and references for what is sparking my interest at the time.
</p>
<p>
Necessarily a never-ending work-in-progress&mdash;this site is itself a reboot/reworking of stuff that came before&mdash;it also a bit of a coding playgound.
</p>`;
    }

    // override in subclasses to define workspace-specific reference list
    references() {
      return null;
    }

  };

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.LM317VoltageWorkspace = (function() {
    // LM317 adjustable regulator calculator
    class LM317VoltageWorkspace extends root.WorkspaceComponent {
      contextName() {
        return 'LM317Voltage';
      }

      recalc(element) {
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
      }

      determineResultElement(vout, r1, r2) {
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
      }

      calculateNewValues(vout, r1, r2) {
        var new_r1, new_r2, new_vout;
        this.calculated || (this.calculated = this.determineResultElement(vout, r1, r2));
        new_vout = vout;
        new_r1 = r1;
        new_r2 = r2;
        if (this.calculated === 'r1') {
          // VOUT = 1.25 * ( 1 + R2/R1 )
          // R2 = R1 ( VOUT / 1.25 - 1 )
          // R1 = R2 / ( VOUT / 1.25 - 1 )
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
      }

      clear() {
        $('#vout', this.container).val('');
        $('#r1', this.container).val('');
        $('#r2', this.container).val('');
        return this.clearCalculated();
      }

      clearCalculated() {
        this.calculated = null;
        return $('[data-trigger=recalc]', this.container).attr('disabled', false);
      }

      bodyTitle() {
        return "LM317 Voltage Calculator";
      }

      bodyTemplate() {
        return `<row>
  <div class="col-md-6">
    <p>
      Given
      <strong>Vout = 1.25 * ( 1 + R2/R1 )</strong>, enter any two values to calculate the other...
    </p>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="voltage" class="control-label">Vout</label>
        <input type="input" class="form-control" data-trigger="recalc" id="vout" placeholder="1.2 to 37 volts" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="resistance" class="control-label">R1</label>
        <input type="input" class="form-control" data-trigger="recalc" id="r1" placeholder="100&Omega; to 1k&Omega;" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="current" class="control-label">R2</label>
        <input type="input" class="form-control" data-trigger="recalc" id="r2" placeholder="&Omega;" autocomplete="off">
      </div>
      <div class="form-group">
        <button class="btn btn-default" data-action="clear">Clear..</button>
      </div>
    </form>
  </div>
  <div class="col-md-6">
    <h4>Typical Application</h4>
    <p class="text-center">
      <img src="app/images/lm317_overview.png" width="400">
    </p>
  </div>
</row>`;
      }

      references() {
        return [
          {
            href: 'http://www.futurlec.com/Linear/LM317T.shtml',
            name: "LM317 Datasheet"
          },
          {
            href: 'http://www.reuk.co.uk/LM317-Voltage-Calculator.htm',
            name: "Another LM317 Voltage Calculator"
          },
          {
            href: 'https://github.com/tardate/LittleArduinoProjects/tree/master/Electronics101/Power317',
            name: "Sample LM317 Arduino Project"
          }
        ];
      }

    };

    LM317VoltageWorkspace.calculated = null;

    return LM317VoltageWorkspace;

  }).call(this);

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  // Microphone sensitivity calculator
  root.MicrophoneCalculatorWorkspace = class MicrophoneCalculatorWorkspace extends root.WorkspaceComponent {
    contextName() {
      return 'MicrophoneCalculator';
    }

    recalc(element) {
      var result, sensitivity, transfer_factor;
      sensitivity = parseFloat($('#sensitivity', this.container).val());
      transfer_factor = parseFloat($('#transfer_factor', this.container).val());
      if (element && element.id) {
        if (element.id === 'sensitivity') {
          transfer_factor = 0/0;
        }
        if (element.id === 'transfer_factor') {
          sensitivity = 0/0;
        }
      }
      result = this.calculateNewValues(sensitivity, transfer_factor);
      if (!(isNaN(result.sensitivity) && isNaN(result.transfer_factor))) {
        $('#sensitivity', this.container).val(result.sensitivity || '');
        $('#transfer_factor', this.container).val(result.transfer_factor || '');
      }
      this.updatePermalink();
      return true;
    }

    calculateNewValues(sensitivity, transfer_factor) {
      var new_sensitivity, new_transfer_factor;
      new_sensitivity = sensitivity;
      new_transfer_factor = transfer_factor;
      if (!isNaN(transfer_factor)) {
        // Sensitivity = 20×log(Transfer factor)
        // Transfer factor = 10 ^ Sensitivity / 20
        new_sensitivity = Math.round(10000 * 20 * Math.log(transfer_factor * 0.001) / Math.log(10)) / 10000;
      }
      if (!isNaN(sensitivity)) {
        new_transfer_factor = Math.round(10000 * 1000 * Math.pow(10, sensitivity / 20)) / 10000;
      }
      return {
        sensitivity: new_sensitivity,
        transfer_factor: new_transfer_factor
      };
    }

    clear() {
      $('#sensitivity', this.container).val('');
      return $('#transfer_factor', this.container).val('');
    }

    clearCalculated() {
      return $('[data-trigger=recalc]', this.container).attr('disabled', false);
    }

    bodyTitle() {
      return "Microphone Sensitivity Calculator";
    }

    bodyTemplate() {
      return `<row>
  <div class="col-md-6">
    <p>
      Enter one value to calculate the other...
    </p>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="sensitivity" class="control-label">Sensitivity (dB)</label>
        <input type="input" class="form-control" data-trigger="recalc" id="sensitivity" placeholder="dB ref 1V/Pa" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="transfer_factor" class="control-label">Transfer Factor (mV/Pascal)</label>
        <input type="input" class="form-control" data-trigger="recalc" id="transfer_factor" placeholder="mV/Pa" autocomplete="off">
      </div>
      <div class="form-group">
        <button class="btn btn-default" data-action="clear">Clear..</button>
      </div>
    </form>
  </div>
  <div class="col-md-6">
  </div>
</row>`;
    }

    references() {
      return [
        {
          href: 'http://www.cui.com/product/resource/cma-4544pf-w.pdf',
          name: "CMA-4544PF-W electret sample datasheet"
        }
      ];
    }

  };

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.OhmsLawWorkspace = (function() {
    // ohms law calculator
    class OhmsLawWorkspace extends root.WorkspaceComponent {
      contextName() {
        return 'OhmsLaw';
      }

      recalc(element) {
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
      }

      determineResultElement(voltage, current, resistance) {
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
      }

      calculateNewValues(voltage, current, resistance) {
        this.calculated || (this.calculated = this.determineResultElement(voltage, current, resistance));
        if (this.calculated === 'voltage') {
          // v = ir
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
      }

      clear() {
        $('#voltage', this.container).val('');
        $('#current', this.container).val('');
        $('#resistance', this.container).val('');
        return this.clearCalculated();
      }

      clearCalculated() {
        this.calculated = null;
        return $('[data-trigger=recalc]', this.container).attr('disabled', false);
      }

      bodyTitle() {
        return "Ohm's Law Calculator";
      }

      bodyTemplate() {
        return `<p>
  Enter any two values to calculate the other...
</p>
<form class="form-inline">
  <div class="form-group">
    <label for="voltage" class="control-label">V</label>
    <input type="input" class="form-control" data-trigger="recalc" id="voltage" placeholder="volts" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="current" class="control-label">= i</label>
    <input type="input" class="form-control" data-trigger="recalc" id="current" placeholder="amps" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="resistance" class="control-label">x R</label>
    <input type="input" class="form-control" data-trigger="recalc" id="resistance" placeholder="&Omega;" autocomplete="off">
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="clear">Clear..</button>
  </div>
</form>`;
      }

      references() {
        return [
          {
            href: 'http://en.wikipedia.org/wiki/Ohm%27s_law',
            name: "Ohm's law on Wikipedia"
          }
        ];
      }

    };

    OhmsLawWorkspace.calculated = null;

    return OhmsLawWorkspace;

  }).call(this);

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.ComponentEquationParser = class ComponentEquationParser {
    static tokenize(expression) {
      var length, p, token, tokens;
      tokens = [];
      length = expression && expression.length || 0;
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
    }

    constructor(expression) {
      this.tokens = this.constructor.tokenize(expression);
    }

    peek() {
      return this.tokens[0] || null;
    }

    pop() {
      if (this.tokens.length > 0) {
        return this.tokens.shift();
      } else {
        return null;
      }
    }

    parse(accumulator) {
      var peek, peek_value;
      accumulator || (accumulator = 0);
      peek = this.peek();
      peek_value = parseFloat(peek);
      if (!isNaN(peek_value) && this.pop()) {
        return this.parse(peek_value);
      } else if (peek === "+" && this.pop()) {
        return accumulator + this.parse();
      } else if (peek === "(" && this.pop()) {
        return this.parse(this.parse(accumulator));
      } else if (peek === ")" && this.pop()) {
        return accumulator;
      } else if (peek === "|" && this.pop()) {
        return 1.0 / (1.0 / accumulator + 1.0 / this.parse());
      } else {
        return accumulator;
      }
    }

  };

  // series and parallel resistor calculator
  root.ResistorCalculatorWorkspace = class ResistorCalculatorWorkspace extends root.WorkspaceComponent {
    calculate(expression) {
      var parser;
      parser = new root.ComponentEquationParser(expression);
      return parser.parse();
    }

    recalc(element) {
      var req;
      req = this.calculate($('#formula', this.container).val());
      $('#req', this.container).text(req);
      return this.updatePermalink();
    }

    clear() {
      return $('#formula', this.container).val('');
    }

    contextName() {
      return 'ResistorCalculator';
    }

    bodyTitle() {
      return "Series and Parallel Resistor Calculator";
    }

    bodyTemplate() {
      return `<p>
  Enter the formula representing the resistor network.
  <ul>
    <li>Add series components with "+"</li>
    <li>Add parallel components with "|"</li>
    <li>Use () to group values</li>
  </ul>
</p>
<form>
  <div class="form-group">
    <label for="formula" class="control-label">Resistor network</label>
    <input type="input" class="form-control" data-trigger="recalc" id="formula" placeholder="e.g: 3+10|10|(10+10)" autocomplete="off">
  </div>
  <div class="form-group">
    <strong>Equivalent resistance:</strong>
    <span id="req">0</span> &Omega;
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="clear">Clear..</button>
  </div>
</form>`;
    }

  };

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  // simple handler of various html/uri encoding tasks
  root.WebEncoderWorkspace = class WebEncoderWorkspace extends root.WorkspaceComponent {
    constructor() {
      super();
      this.outElement = $('#outText', this.container);
      this.inElement = $('#inText', this.container);
    }

    contextName() {
      return 'WebEncoder';
    }

    bodyTitle() {
      return "HTML and URI Encoding";
    }

    bodyTemplate() {
      return `<form id="webEncoder">
  <div class="form-group">
    <label for="inText">source</label>
    <textarea id="inText" class="form-control" rows=6 wrap="off" placeholder="enter your text, html or javaScript to convert here"></textarea>
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="htmlEncode">HTML Encode</button>
    <button class="btn btn-default" data-action="encodeURI">URI Encode</button>
    <button class="btn btn-default" data-action="encodeURIComponent">URI Encode Component</button>
    <button class="btn btn-default" data-action="uriEscape">URI Escape</button>
    <button class="btn btn-default" data-action="clearBoth">Clear..</button>
  </div>
  <div class="form-group">
    <label for="outText">encoded output</label>
    <textarea id="outText" class="form-control" rows=6 wrap="off"></textarea>
  </div>
</form>`;
    }

    references() {
      return [
        {
          href: 'http://old.stevenharman.net/blog/archive/2007/06/16/url-and-html-encoding-on-the-client-javascript-to-the.aspx',
          name: 'URL and HTML Encoding on the Client? JavaScript to the Rescue!'
        },
        {
          href: 'http://xkr.us/articles/javascript/encode-compare/',
          name: 'Comparing escape(), encodeURI(), and encodeURIComponent()'
        },
        {
          href: 'http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery',
          name: 'Escaping HTML strings with jQuery'
        }
      ];
    }

    htmlEncode() {
      this.outElement.val($("<div></div>").text(this.inElement.val()).html());
      return this.recalc();
    }

    encodeURI() {
      this.outElement.val(encodeURI(this.inElement.val()));
      return this.recalc();
    }

    encodeURIComponent() {
      this.outElement.val(encodeURIComponent(this.inElement.val()));
      return this.recalc();
    }

    uriEscape() {
      this.outElement.val(escape(this.inElement.val()));
      return this.recalc();
    }

    clearBoth() {
      this.outElement.val('');
      this.inElement.val('').focus();
      return this.recalc();
    }

  };

}).call(this);
