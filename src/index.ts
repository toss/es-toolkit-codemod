import type { API, Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { lodashFunctionsLowerCaseToOriginalMap } from './constants';
import { detectQuoteStyle } from './detect-quote-style';

export default function transform(file: FileInfo, api: API): string | null {
  const { jscodeshift: j } = api;

  try {
    const root = j(file.source);
    let hasChanges = false;

    // Transform all lodash-related imports
    hasChanges = transformLodashImports(root, j) || hasChanges;

    // Detect quote style used in original code
    const quoteStyle = detectQuoteStyle(file.source);

    return hasChanges ? root.toSource({ quote: quoteStyle }) : null;
  } catch (error) {
    console.error(`Error transforming file ${file.path}:`, error);
    return null;
  }
}

function transformLodashImports(root: Collection, j: JSCodeshift): boolean {
  const transformers = [
    transformLodashDefaultImports,
    transformLodashEsImports,
    transformLodashFunctionImports,
    transformLodashIndividualPackages,
  ];

  const hasChanges = transformers.reduce((hasChanges, transform) => transform(root, j) || hasChanges, false);

  return hasChanges;
}

// import _ from 'lodash' → import _ from 'es-toolkit/compat'
function transformLodashDefaultImports(root: Collection, j: JSCodeshift): boolean {
  const lodashImports = root.find(j.ImportDeclaration, {
    source: { value: 'lodash' },
  });

  if (lodashImports.length === 0) {
    return false;
  }

  lodashImports.replaceWith((path) => {
    const { node } = path;

    if (node.specifiers) {
      const defaultSpecifier = node.specifiers.find((spec) => spec.type === 'ImportDefaultSpecifier');

      if (defaultSpecifier?.local) {
        return j.importDeclaration([j.importDefaultSpecifier(defaultSpecifier.local)], j.literal('es-toolkit/compat'));
      }
      // import { foo, bar } from 'lodash' → import { foo, bar } from 'es-toolkit/compat'
      return j.importDeclaration(node.specifiers, j.literal('es-toolkit/compat'));
    }
    return node;
  });

  return true;
}

// import { foo, bar } from 'lodash-es' → import { foo, bar } from 'es-toolkit/compat'
function transformLodashEsImports(root: Collection, j: JSCodeshift): boolean {
  const lodashEsImports = root.find(j.ImportDeclaration, {
    source: { value: 'lodash-es' },
  });

  if (lodashEsImports.length === 0) {
    return false;
  }

  lodashEsImports.replaceWith((path) => {
    const { node } = path;

    if (node.specifiers) {
      return j.importDeclaration(node.specifiers, j.literal('es-toolkit/compat'));
    }
    return node;
  });

  return true;
}

// import debounce from 'lodash/debounce' → import debounce from 'es-toolkit/compat/debounce'
function transformLodashFunctionImports(root: Collection, j: JSCodeshift): boolean {
  const lodashFunctionImports = root.find(j.ImportDeclaration).filter((path) => {
    const source = path.node.source.value;
    return typeof source === 'string' && source.startsWith('lodash/');
  });

  if (lodashFunctionImports.length === 0) {
    return false;
  }

  lodashFunctionImports.replaceWith((path) => {
    const { node } = path;
    const modulePath = node.source.value as string;
    const functionName = modulePath.replace('lodash/', '');

    if (node.specifiers?.[0]?.local) {
      const localIdentifier = node.specifiers[0].local;

      // Keep the original default import structure
      return j.importDeclaration(
        [j.importDefaultSpecifier(localIdentifier)],
        j.literal(`es-toolkit/compat/${functionName}`),
      );
    }
    return node;
  });

  return true;
}

// import sortBy from 'lodash.sortby' → import sortBy from 'es-toolkit/compat/sortby'
function transformLodashIndividualPackages(root: Collection, j: JSCodeshift): boolean {
  const lodashIndividualImports = root.find(j.ImportDeclaration).filter((path) => {
    const source = path.node.source.value;
    if (typeof source !== 'string' || !source.startsWith('lodash.')) {
      return false;
    }

    const packageName = source.replace('lodash.', '');
    return lodashFunctionsLowerCaseToOriginalMap.has(packageName);
  });

  if (lodashIndividualImports.length === 0) {
    return false;
  }

  lodashIndividualImports.replaceWith((path) => {
    const { node } = path;
    const modulePath = node.source.value as string;
    const lowercaseFunctionName = modulePath.replace('lodash.', '');
    const originalFunctionName = lodashFunctionsLowerCaseToOriginalMap.get(lowercaseFunctionName);

    if (node.specifiers?.[0]?.local && originalFunctionName) {
      const localIdentifier = node.specifiers[0].local;

      return j.importDeclaration(
        [j.importDefaultSpecifier(localIdentifier)],
        j.literal(`es-toolkit/compat/${originalFunctionName}`),
      );
    }
    return node;
  });

  return true;
}
