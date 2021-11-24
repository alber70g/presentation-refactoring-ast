import {
  FileVisitor,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { Project } from 'ts-morph';
import { path } from 'zx';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function importFromLodashEs(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const fileVisitor: FileVisitor = (filePath, entry) => {
      if (
        filePath.includes('node_modules') ||
        filePath.includes('my-org-refactor-lib') ||
        !(filePath.match(/\.tsx?$/) && entry && entry.content)
      ) {
        return;
      }
      // const updater = tree.beginUpdate(filePath);

      const sourceFile = ts.createSourceFile(
        filePath,
        (tree.read(filePath) as Buffer).toString('utf8'),
        ts.ScriptTarget.Latest,
        true
      );

      // find import statements for 'lodash' with '* as _'
      const importStatement = getImportStatement(sourceFile);
      if (!importStatement) {
        return;
      }

      // find '_.function' usages
      const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      });
      project.addSourceFileAtPath(filePath);
      project.getSourceFile(filePath)?.getImportDeclaration;

      findLodashUsages(sourceFile);
      // change import statement into '{ function }'
    };
    tree.visit(fileVisitor);
    return tree;
  };
}

function findLodashUsages(sourceFile: ts.SourceFile): ts.ImportClause | void {
  let foundNode: ts.ImportClause | undefined = undefined;
  sourceFile.forEachChild(function astVisitor(node) {
    if (foundNode) {
      return;
    }
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier.getText(sourceFile) === 'lodash'
    ) {
      if (node.importClause && node.importClause.namedBindings) {
        if (node.importClause.getText(sourceFile) === '* as _') {
          foundNode = node.importClause;
        }
      }
    }
    node.forEachChild(astVisitor);
  });
}
function getImportStatement(sourceFile: ts.SourceFile): ts.ImportClause | void {
  let foundNode: ts.ImportClause | undefined = undefined;
  sourceFile.forEachChild(function astVisitor(node) {
    if (foundNode) {
      return;
    }
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier.getText(sourceFile) === 'lodash'
    ) {
      if (node.importClause && node.importClause.namedBindings) {
        if (node.importClause.getText(sourceFile) === '* as _') {
          foundNode = node.importClause;
        }
      }
    }
    node.forEachChild(astVisitor);
  });
}
