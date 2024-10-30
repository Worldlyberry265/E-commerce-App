import { AddDecimalPipe } from "./add-decimal.pipe";

describe('AdddecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new AddDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
