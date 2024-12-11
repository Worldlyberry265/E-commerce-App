import { AddDecimalPipe } from './add-decimal.pipe';

describe('AddDecimalPipe', () => {
  let pipe: AddDecimalPipe;

  beforeEach(() => {
    pipe = new AddDecimalPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should append .0 to an integer rating', () => {
    expect(pipe.transform(4)).toBe('4.0');
    expect(pipe.transform(0)).toBe('0.0');
  });

  it('should return the rating as a string', () => {
    expect(pipe.transform(4.5)).toBe('4.5');
    expect(pipe.transform(3.25)).toBe('3.25');
  });

});
