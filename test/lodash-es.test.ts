import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";
import { lodashFunctions } from "./constants";


describe('lodash-es transformation', () => {
  it('should transform default lodash-es import', () => {
    const input = `import _ from 'lodash-es';`;
    const expected = `import _ from 'es-toolkit/compat';`;
    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  it('should transform lodash-es imports', () => {
    const input = `import { map, filter } from 'lodash-es';
const result = map([1, 2, 3], x => x * 2);`;

    const expected = `import { map, filter } from 'es-toolkit/compat';
const result = map([1, 2, 3], x => x * 2);`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  describe('each functions at lodash-es', () => {
    it.each(lodashFunctions)('should transform %s import', (func) => {
      const input = `import { ${func} } from 'lodash-es';`;
      const expected = `import { ${func} } from 'es-toolkit/compat';`;
      const result = testTransform(input);
      expect(result).toBe(expected);
    });
  })
});