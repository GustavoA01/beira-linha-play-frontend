const ts = require('typescript');

/** ts-jest leaves import.meta in the output, which Node refuses to load as CJS. */
module.exports = {
  process(source, filename) {
    const rewritten = source.replace(/import\.meta\.env/g, 'process.env');
    const { outputText } = ts.transpileModule(rewritten, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    });

    return { code: outputText };
  },
};
