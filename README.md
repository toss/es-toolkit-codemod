![cover](./public/og.png)

# @es-toolkit/codemod &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

English | [한국어](https://github.com/toss/es-toolkit-codemod/blob/main/README-ko_kr.md)

## 🚀 Quick Start

```bash
# Using npm
npx @es-toolkit/codemod src/

# Using yarn
yarn dlx @es-toolkit/codemod src/

# Preview mode (check changes without applying them)
npx @es-toolkit/codemod src/ --dry
```

## 📋 Supported transformations

### 1. Default Import

```javascript
// Before
import _ from "lodash";

// After
import * as _ from "es-toolkit/compat";
```

### 2. Named Import

```javascript
// Before
import { map, filter, reduce } from "lodash";

// After
import { map, filter, reduce } from "es-toolkit/compat";
```

### 3. Individual Function Import

```javascript
// Before
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

// After
import debounce from "es-toolkit/compat/debounce";
import throttle from "es-toolkit/compat/throttle";
```

> [!NOTE]
> The variable/function name will be preserved.
> e.g. `import debounceFn from 'lodash/debounce'` will be transformed to `import debounceFn from 'es-toolkit/compat/debounce'`

### 4. lodash-es Import

```javascript
// Before
import { map, filter } from "lodash-es";

// After
import { map, filter } from "es-toolkit/compat";
```

## 🎯 Usage

### Basic Usage

```bash
npx @es-toolkit/codemod <path>
```

### Options

| Option          | Description                         | Example                |
| --------------- | ----------------------------------- | ---------------------- |
| `<path>`        | File or directory path to transform | `src/` , `components/` |
| `--dry`         | Preview mode (don't apply changes)  | `--dry`                |
| `--help` , `-h` | Show help                           | `--help`               |

### Usage Examples

```bash
# Transform entire src directory
npx @es-toolkit/codemod src/

# Transform specific file only
npx @es-toolkit/codemod src/utils/helpers.ts

# Check changes in preview mode
npx @es-toolkit/codemod src/ --dry

# Transform components directory only
npx @es-toolkit/codemod src/components/
```

## 🔗 Related Links

- [es-toolkit Documentation](https://es-toolkit.slash.page)
- [es-toolkit GitHub](https://github.com/toss/es-toolkit)

## License

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
