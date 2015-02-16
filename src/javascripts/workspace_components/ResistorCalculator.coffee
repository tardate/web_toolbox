root = exports ? this

class root.ComponentEquationParser

  @tokenize: (expression)->
    tokens = []
    length = expression && expression.length || 0
    p = 0
    token = ""
    while p < length
      if expression[p].match(/[\+\|\(\)]/)
        if token
          tokens.push token
          token = ""
        tokens.push expression[p]
      if expression[p].match(/[\d\.]/)
        token = token + expression[p]
      p += 1
    tokens.push token if token
    return tokens

  constructor: (expression) ->
    @tokens = @constructor.tokenize expression

  peek: ->
    @tokens[0] || null

  pop: ->
    if @tokens.length > 0 then @tokens.shift() else null

  parse: (accumulator)->
    accumulator ||= 0
    peek = @peek()
    peek_value = parseFloat peek
    if not isNaN(peek_value) and @pop()
      return @parse(peek_value)
    else if peek is "+" and @pop()
      return accumulator + @parse()
    else if peek is "(" and @pop()
      return @parse(@parse(accumulator))
    else if peek is ")" and @pop()
      return accumulator
    else if peek is "|" and @pop()
      return  1.0/(1.0/accumulator + 1.0/@parse())
    else
      accumulator

# series and parallel resistor calculator
class root.ResistorCalculatorWorkspace extends root.WorkspaceComponent

  calculate: (expression)->
    parser = new root.ComponentEquationParser(expression)
    return parser.parse()

  recalc: (element)->
    req = @calculate( $('#formula',@container).val() )
    $('#req',@container).text(req)
    @updatePermalink()

  contextName: ->
    'ResistorCalculator'

  bodyTitle: ->
    "Series and Parallel Resistor Calculator"

  bodyTemplate: ->
    """
<p>
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
</form>
    """