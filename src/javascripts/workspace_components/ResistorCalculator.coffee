root = exports ? this

class root.Parser

  @tokenize: (expression)->
    tokens = []
    length = expression.length
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
    @tokens = root.Parser.tokenize expression

  peek: ->
    @tokens[0] || null

  next: ->
    if @tokens.length > 0 then @tokens.shift() else null

  result:->
    term = @parse_term()
    while 1
      peek = @peek()

      if peek is "+" and @next()
        term = term + @parse_term()

      else if peek is null
        return term

      else
        throw "malformed"

  parse_term: ->
    factor = @parse_factor()
    while 1
      peek = @peek()
      if peek is "|" and @next()
        factor = 1.0/(1.0/factor + 1.0/@parse_factor())
      else
        return factor

  parse_factor: ->

    if @peek() is "(" and @next()
      expr = []
      throw "incomplete brackets" if @tokens.indexOf(")") is -1

      expr.push next while (next = @next()) isnt ")"

      p = new Parser(expr)

      return p.result()

    else if not isNaN(parseFloat @peek())
      return parseFloat @next()
    else
      throw "malformed expression"


# series and parallel resistor calculator
class root.ResistorCalculatorWorkspace extends root.WorkspaceComponent

  @calculated: null

  calculate: (expression)->
    parser = new root.Parser(expression)
    result = parser.result()
    return result

  contextName: ->
    'ResistorCalculator'

  bodyTitle: ->
    "Series and Parallel Resistor Caclulator"

  bodyTemplate: ->
    """
<p>
  Enter the formula representing the resistor network. Separate parallel components with "|", and use () to group resistance values
</p>
<form class="form-horizontal">
  <div class="form-group">
    <label for="formula" class="control-label">Resistor network</label>
    <input type="input" class="form-control" data-trigger="recalc" id="formula" placeholder="enter formula" autocomplete="off">
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="clear">Clear..</button>
  </div>
</form>
    """