import { IframeUrlCreatorPipe } from './iframe-url-creator.pipe';

describe('IframeUrlCreatorPipe', () => {
  it('create an instance', () => {
    const pipe = new IframeUrlCreatorPipe();
    expect(pipe).toBeTruthy();
  });
});
