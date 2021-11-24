import { Project } from 'ts-morph';
import { path } from 'zx';

const tsConfigFilePath = path.join(process.cwd(), 'tsconfig.json');
const project = new Project({
  tsConfigFilePath,
});
project.addSourceFilesFromTsConfig(tsConfigFilePath);

const sourceFile = project.getSourceFileOrThrow('src/helpers/helpers.ts');

// find exports
const exportedNamedFunctions = sourceFile
  .getFunctions()
  .filter((f) => f.isExported())
  .filter((f) => f.isNamedExport());

exportedNamedFunctions.map((f) => {
  // find references
  const exportedReferences = f.findReferences();

  // move exports to their own files
  const functionName = f.getNameOrThrow();
  const newFilePath = path.join(
    path.dirname(f.getSourceFile().getFilePath()),
    `${functionName}.ts`
  );
  const newFile = f.getFullText();
  const newSourceFile = project.createSourceFile(newFilePath, newFile);

  // update all references
  exportedReferences.forEach((r) => {
    r.getReferences()
      .filter((ref) => !ref.isDefinition())
      .forEach((ref) => {
        ref
          .getSourceFile()
          .getImportDeclarations()
          .filter(
            (imp) =>
              imp.getModuleSpecifierSourceFile()?.getFilePath() ===
              sourceFile.getFilePath()
          )
          .forEach((imp) => {
            imp
              .getNamedImports()
              .find((ni) => ni.getName() === functionName)
              ?.remove();
            const newModuleSpecifier = ref
              .getSourceFile()
              .getRelativePathAsModuleSpecifierTo(newSourceFile);
            if (
              !ref
                .getSourceFile()
                .getImportDeclarations()
                .find(
                  (im) =>
                    im.getModuleSpecifier().getText() === `"${newModuleSpecifier}"`
                )
            ) {
              ref.getSourceFile().addImportDeclaration({
                namedImports: [functionName],
                moduleSpecifier: newModuleSpecifier,
              });
            }
          });
      });
  });
});

// delete old functions
exportedNamedFunctions.forEach((enf) => enf.remove());

project.save();
