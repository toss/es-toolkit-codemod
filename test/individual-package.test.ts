import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";
import { lodashFunctions } from "../src/constants";

describe("lodash individual package imports", () => {
  it("should transform lodash individual package imports", () => {
    const testCases = [
      {
        input: `import debounce from 'lodash.debounce';`,
        output: `import debounce from 'es-toolkit/compat/debounce';`,
      },
      {
        input: `import sortBy from 'lodash.sortby';`,
        output: `import sortBy from 'es-toolkit/compat/sortBy';`,
      },
      {
        input: `import isEqual from 'lodash.isequal';`,
        output: `import isEqual from 'es-toolkit/compat/isEqual';`,
      },
      {
        input: `import zipObject from 'lodash.zipobject';`,
        output: `import zipObject from 'es-toolkit/compat/zipObject';`,
      },
      {
        input: `import flatMapDeep from 'lodash.flatmapdeep';`,
        output: `import flatMapDeep from 'es-toolkit/compat/flatMapDeep';`,
      },
    ];

    testCases.forEach(({ input, output }) => {
      expect(testTransform(input)).toBe(output);
    });
  });

  describe("each functions at lodash", () => {
    it.each(lodashFunctions)("should transform %s", (func) => {
      const input = `import ${func} from 'lodash.${func.toLocaleLowerCase()}';`;
      const output = `import ${func} from 'es-toolkit/compat/${func}';`;
      expect(testTransform(input)).toBe(output);
    });

    it.each(lodashFunctions)("should transform aliased %s", (func) => {
      const alias = `my${func}`;
      const input = `import ${alias} from 'lodash.${func.toLocaleLowerCase()}';`;
      const output = `import ${alias} from 'es-toolkit/compat/${func}';`;
      expect(testTransform(input)).toBe(output);
    });
  });
});
