![](./public/og.png)

# @es-toolkit/codemod &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](https://github.com/toss/es-toolkit-codemod/blob/main/README.md) | 한국어

## 🚀 빠른 시작

```bash
# npm을 사용하는 경우
npx @es-toolkit/codemod src/

# yarn을 사용하는 경우
yarn dlx @es-toolkit/codemod src/

# 미리보기 모드 (변경사항을 적용하지 않고 확인만)
npx @es-toolkit/codemod src/ --dry
```

## 📋 지원하는 변환

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
> 변수/함수 이름이 유지돼요.
> e.g. `import debounceFn from 'lodash/debounce'` → `import debounceFn from 'es-toolkit/compat/debounce'`

### 4. lodash-es Import

```javascript
// Before
import { map, filter } from "lodash-es";

// After
import { map, filter } from "es-toolkit/compat";
```

## 🎯 사용법

### 기본 사용법

```bash
npx @es-toolkit/codemod <path>
```

### 옵션

| 옵션            | 설명                           | 예시                   |
| --------------- | ------------------------------ | ---------------------- |
| `<path>`        | 변환할 파일 또는 디렉토리 경로 | `src/` , `components/` |
| `--dry`         | 미리보기 모드 (변경 적용 안함) | `--dry`                |
| `--help` , `-h` | 도움말 표시                    | `--help`               |

### 사용 예시

```bash
# 전체 src 디렉토리 변환
npx @es-toolkit/codemod src/

# 특정 파일만 변환
npx @es-toolkit/codemod src/utils/helpers.ts

# 미리보기 모드로 변경사항 확인
npx @es-toolkit/codemod src/ --dry

# components 디렉토리만 변환
npx @es-toolkit/codemod src/components/
```

## 🔗 관련 링크

- [es-toolkit 공식 문서](https://es-toolkit.slash.page)
- [es-toolkit GitHub](https://github.com/toss/es-toolkit)

## License

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
