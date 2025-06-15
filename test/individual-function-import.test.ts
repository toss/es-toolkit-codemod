import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";
import { lodashFunctions } from "../src/constants";

describe('individual function import transformation', () => {
  it('should transform individual lodash function imports', () => {
    const input = `import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
const fn = debounce(() => {}, 100);`;

    const expected = `import debounce from 'es-toolkit/compat/debounce';
import throttle from 'es-toolkit/compat/throttle';
const fn = debounce(() => {}, 100);`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  it('should handle aliased function imports', () => {
    const input = `import myDebounce from 'lodash/debounce';
const fn = myDebounce(() => {}, 100);`;

    const expected = `import myDebounce from 'es-toolkit/compat/debounce';
const fn = myDebounce(() => {}, 100);`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  describe('each functions at lodash', () => {
    it.each(lodashFunctions)('should transform %s import', (func) => {
      const input = `import ${func} from 'lodash/${func}';`;
      const expected = `import ${func} from 'es-toolkit/compat/${func}';`;
      const result = testTransform(input);
      expect(result).toBe(expected);
    });

    it.each(lodashFunctions)('should transform aliased %s import', (func) => {
      const alias = `my${func}`;
      
      const input = `import ${alias} from 'lodash/${func}';`;
      const expected = `import ${alias} from 'es-toolkit/compat/${func}';`;
      const result = testTransform(input);
      expect(result).toBe(expected);
    });
  })
});