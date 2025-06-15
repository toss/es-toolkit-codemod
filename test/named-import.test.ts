import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";

describe('named import transformation', () => {
  it('should transform named lodash imports', () => {
    const input = `import { map, filter, reduce } from 'lodash';
const result = map([1, 2, 3], x => x * 2);`;

    const expected = `import { map, filter, reduce } from 'es-toolkit/compat';
const result = map([1, 2, 3], x => x * 2);`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });
});