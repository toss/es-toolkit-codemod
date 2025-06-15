import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";

describe('quote style preservation', () => {
  it('should preserve single quotes when used in original code', () => {
    const input = `import _ from 'lodash';
import { map } from 'lodash-es';
import debounce from 'lodash/debounce';`;

    const expected = `import _ from 'es-toolkit/compat';
import { map } from 'es-toolkit/compat';
import debounce from 'es-toolkit/compat/debounce';`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  it('should preserve double quotes when used in original code', () => {
    const input = `import _ from "lodash";
import { map } from "lodash-es";
import debounce from "lodash/debounce";`;

    const expected = `import _ from "es-toolkit/compat";
import { map } from "es-toolkit/compat";
import debounce from "es-toolkit/compat/debounce";`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  it('should use double quotes when mixed quotes but double quotes are more frequent', () => {
    const input = `import _ from "lodash";
import { map } from "lodash-es";
import debounce from 'lodash/debounce';
import React from "react";`;

    const expected = `import _ from "es-toolkit/compat";
import { map } from "es-toolkit/compat";
import debounce from "es-toolkit/compat/debounce";
import React from "react";`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });

  it('should use single quotes when mixed quotes but single quotes are more frequent', () => {
    const input = `import _ from 'lodash';
import { map } from 'lodash-es';
import debounce from "lodash/debounce";
import React from 'react';`;

    const expected = `import _ from 'es-toolkit/compat';
import { map } from 'es-toolkit/compat';
import debounce from 'es-toolkit/compat/debounce';
import React from 'react';`;

    const result = testTransform(input);
    expect(result).toBe(expected);
  });
});