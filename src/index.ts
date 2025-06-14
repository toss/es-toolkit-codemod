import { parse, Lang, SgNode, Edit } from "@ast-grep/napi";
import { detectQuoteStyle } from "./detect-quote-style";
import { FileInfo } from "jscodeshift";
import { Kinds, TypesMap } from "@ast-grep/napi/types/staticTypes";

type Root = SgNode<TypesMap, Kinds<TypesMap>>;

export default function transform(fileInfo: FileInfo): string | null {
  const { path: filePath, source: fileSource } = fileInfo;

  try {
    const ast = parse(Lang.JavaScript, fileSource);
    const root = ast.root();

    const quote = detectQuoteStyle(fileSource);

    const transformFunctions: Array<(root: Root, quote: string) => Edit[]> = [
      transformFunctionImports,
      transformNamedImports,
      transformDefaultImports,
      transformLodashEsImports,
    ];

    const allEdits = transformFunctions.reduce((edits, transformFn) => {
      edits.push(...transformFn(root, quote));
      return edits;
    }, [] as Edit[]);

    if (allEdits.length === 0) {
      return null;
    }

    // Apply all edits using commitEdits on the root
    const newSource = root.commitEdits(allEdits);
    return newSource;
  } catch (error) {
    console.error(`Error transforming file ${filePath}:`, error);
    return null;
  }
}



// Transform lodash function imports: import debounce from 'lodash/debounce' -> import debounce from 'es-toolkit/compat/debounce'
function transformFunctionImports(root: Root, quote: string) {
  const edits = [];

  const functionImports = root
    .findAll("import $NAME from $SOURCE")
    .filter((node) => {
      const source = node.getMatch("SOURCE");
      if (!source) return false;
      const sourceText = source.text();
      return (
        sourceText.includes("lodash/") && !sourceText.includes("lodash-es")
      );
    });

  for (const node of functionImports) {
    const nameNode = node.getMatch("NAME");
    const sourceNode = node.getMatch("SOURCE");
    if (nameNode && sourceNode) {
      const localName = nameNode.text();
      const sourceText = sourceNode.text();
      const match = sourceText.match(/['"]lodash\/(\w+)['"]/);
      if (match) {
        const functionName = match[1];
        const replacement = `import ${localName} from ${quote}es-toolkit/compat/${functionName}${quote}`;
        edits.push(node.replace(replacement + ";"));
      }
    }
  }

  return edits;
}

// Transform lodash named imports: import { foo, bar } from 'lodash' -> import { foo, bar } from 'es-toolkit/compat'
function transformNamedImports(root: Root, quote: string) {
  const edits = [];

  const namedImports = root
    .findAll("import { $$$SPECS } from $SOURCE")
    .filter((node) => {
      const source = node.getMatch("SOURCE");
      if (!source) return false;
      const sourceText = source.text();
      return sourceText === '"lodash"' || sourceText === "'lodash'";
    });

  for (const node of namedImports) {
    // Extract the original import specifiers text from the source
    const nodeText = node.text();
    const match = nodeText.match(/import\s*\{\s*([^}]+)\s*\}/);
    if (match) {
      const specifiersText = match[1].trim();
      const replacement = `import { ${specifiersText} } from ${quote}es-toolkit/compat${quote}`;
      edits.push(node.replace(replacement + ";"));
    }
  }

  return edits;
}

// Transform lodash default imports: import _ from 'lodash' -> import * as _ from 'es-toolkit/compat'
function transformDefaultImports(root: Root, quote: string) {
  const edits = [];

  const defaultImports = root
    .findAll("import $NAME from $SOURCE")
    .filter((node) => {
      const source = node.getMatch("SOURCE");
      if (!source) return false;
      const sourceText = source.text();
      const isLodash = sourceText === '"lodash"' || sourceText === "'lodash'";
      // Make sure this is NOT a named import by checking the node text
      const nodeText = node.text();
      const isNotNamed = !nodeText.includes("{");
      return isLodash && isNotNamed;
    });

  for (const node of defaultImports) {
    const nameNode = node.getMatch("NAME");
    if (nameNode) {
      const localName = nameNode.text();
      const replacement = `import * as ${localName} from ${quote}es-toolkit/compat${quote}`;
      edits.push(node.replace(replacement + ";"));
    }
  }

  return edits;
}

// Transform lodash-es imports: import { foo, bar } from 'lodash-es' -> import { foo, bar } from 'es-toolkit/compat'
function transformLodashEsImports(root: Root, quote: string) {
  const edits = [];

  const lodashEsImports = root
    .findAll("import { $$$SPECS } from $SOURCE")
    .filter((node) => {
      const source = node.getMatch("SOURCE");
      if (!source) return false;
      const sourceText = source.text();
      return sourceText === '"lodash-es"' || sourceText === "'lodash-es'";
    });

  for (const node of lodashEsImports) {
    // Extract the original import specifiers text from the source
    const nodeText = node.text();
    const match = nodeText.match(/import\s*\{\s*([^}]+)\s*\}/);
    if (match) {
      const specifiersText = match[1].trim();
      const replacement = `import { ${specifiersText} } from ${quote}es-toolkit/compat${quote}`;
      edits.push(node.replace(replacement + ";"));
    }
  }

  return edits;
}
