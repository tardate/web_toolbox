
describe("ResistorCalculatorWorkspace.calculate()", function() {
  var subject = new ResistorCalculatorWorkspace();

  it("given simple series expression", function() {
    expect(subject.calculate('1+1')).toEqual(2.0);
    expect(subject.calculate('500.0+(50+5)+5000')).toEqual(5555.0);
  });

  it("given simple parallel expression", function() {
    expect(subject.calculate('2|2')).toEqual(1.0);
    expect(subject.calculate('3|3|3')).toEqual(1.0);
    expect(subject.calculate('50+3|3|3')).toEqual(51.0);
    expect(subject.calculate('50+(3|3|3)')).toEqual(51.0);
    // expect(subject.calculate('(2+1)|3|3)')).toEqual(1.0);
  });

});

describe("Parser.tokenize()", function() {
  var subject = Parser;

  it("given series and parallel expressions", function() {
    expect(subject.tokenize('1+1')).toEqual(['1','+','1']);
    expect(subject.tokenize('10 + 1')).toEqual(['10','+','1']);
    expect(subject.tokenize('4.7 + ( 100 | 10)')).toEqual(['4.7', '+', '(', '100', '|', '10', ')']);
  });

});

