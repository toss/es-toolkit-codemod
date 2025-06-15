import { describe, expect, it } from "vitest";
import { testTransform } from "./helpers";

describe('no change scenarios', () => {
  it('should not modify non-lodash imports', () => {
    const input = `import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
const [state, setState] = useState(0);
return <div>{state}</div>;
};`;

    const result = testTransform(input);
    expect(result).toBeNull(); // No changes expected
  });

  it('should not modify files without imports', () => {
    const input = `const myFunction = () => {
console.log('Hello world');
};

export default myFunction;`;

    const result = testTransform(input);
    expect(result).toBeNull(); // No changes expected
  });
});