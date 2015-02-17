
describe("ResistorCalculatorWorkspace.calculate()", function() {
  var subject = new ResistorCalculatorWorkspace();

  it("given simple series expression", function() {
    expect(subject.calculate('1+1')).toEqual(2.0);
    expect(subject.calculate('1+1+50')).toEqual(52.0);
  });

  it("given parathetical series expression", function() {
    expect(subject.calculate('(1+1)+2')).toEqual(4.0);
    expect(subject.calculate('(1+1)+(1+1)')).toEqual(4.0);
    expect(subject.calculate('((1+1)+(1+1))')).toEqual(4.0);
    expect(subject.calculate('500.0+(50+5)+5000')).toEqual(5555.0);
    expect(subject.calculate("(((((6|((6|(1+2))+10))+2)|6)+9)|4)+2")).toEqual(5.0);
    expect(subject.calculate('6+(18|(3+6))+10')).toEqual(22.0);
  });

  it("given simple parallel expression", function() {
    expect(subject.calculate('2|2')).toEqual(1.0);
    expect(subject.calculate('3|3|3')).toEqual(1.0);
    expect(subject.calculate('4+50+3|3|3')).toEqual(55.0);
  });

  it("given parathetical parallel expression", function() {
    expect(subject.calculate('50+(3|3|3)')).toEqual(51.0);
  });

  it("given complex parathetical expression", function() {
    expect(subject.calculate('(1+1)|2')).toEqual(1.0);
  });

  it("given bad expression", function() {
    expect(subject.calculate('(/#$%))')).toEqual(0);
  });

});

describe("Parser.tokenize()", function() {
  var subject = ComponentEquationParser;

  it("given series and parallel expressions", function() {
    expect(subject.tokenize('1+1')).toEqual(['1','+','1']);
    expect(subject.tokenize('((1+1)+(1+1))')).toEqual([ '(', '(', '1', '+', '1', ')', '+', '(', '1', '+', '1', ')', ')' ]);
    expect(subject.tokenize('10 + 1')).toEqual(['10','+','1']);
    expect(subject.tokenize('4.7 + ( 100 | 10)')).toEqual(['4.7', '+', '(', '100', '|', '10', ')']);
    expect(subject.tokenize('(1+1)|2)')).toEqual(['(', '1', '+', '1', ')', '|', '2', ')']);
  });

});

