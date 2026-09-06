import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
export function loadModule(filename, { globals = {}, mocks = {} } = {}) {
  const cache = new Map();
  const context = vm.createContext({
    console,
    URL,
    URLSearchParams,
    Request,
    Response,
    TextDecoder,
    TextEncoder,
    Uint8Array,
    AbortSignal,
    setTimeout,
    clearTimeout,
    process: { env: {} },
    ...globals,
  });
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const mod = { exports: {} };
    cache.set(absolute, mod);
    const code = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText;
    const localRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith("."))
        return load(
          path.resolve(
            path.dirname(absolute),
            id.endsWith(".ts") ? id : id + ".ts",
          ),
        );
      return require(id);
    };
    vm.runInContext(
      "(function(require,module,exports){" + code + "\n})",
      context,
      { filename: absolute },
    )(localRequire, mod, mod.exports);
    return mod.exports;
  }
  return load(filename);
}
