import { CountServicioPipe } from './count-servicio.pipe';

describe('CountServicioPipe', () => {
  it('create an instance', () => {
    const pipe = new CountServicioPipe();
    expect(pipe).toBeTruthy();
  });
});
