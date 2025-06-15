import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";

describe('default import transformation', () => {
  it('should transform default lodash import to namespace import', () => {
    const input = `import _ from 'lodash';
console.log(_.map([1, 2, 3], x => x * 2));`;

    const expected = `import _ from 'es-toolkit/compat';
console.log(_.map([1, 2, 3], x => x * 2));`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });
});