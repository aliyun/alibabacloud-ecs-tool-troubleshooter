import { InstanceStatusDescPipe } from './instance-status-desc.pipe';

describe('InstanceStatusDescPipe', () => {
  it('create an instance', () => {
    const pipe = new InstanceStatusDescPipe();
    expect(pipe).toBeTruthy();
  });
});
