import jscodeshift from 'jscodeshift';
import transform from "../src";

export function testTransform(input: string): string | null {
  const fileInfo = {
    path: 'test.js',
    source: input,
  };

  const j = jscodeshift.withParser('tsx');
  const api = {
    jscodeshift: j,
    j: j,
    stats: () => {},
    report: () => {},
  };

  return transform(fileInfo, api);
}