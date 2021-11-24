import {
  FileVisitor,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import ts = require('typescript');

export function useParseFloat(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const fileVisitor: FileVisitor = (filePath, entry) => {
      if (
        filePath.includes('node_modules') ||
        filePath.includes('my-org-refactor-lib') ||
        !(filePath.match(/\.tsx?$/) && entry && entry.content)
      ) {
        return;
      }

      const updater = tree.beginUpdate(filePath);

      const sourceFile = ts.createSourceFile(
        filePath,
        (tree.read(filePath) as Buffer).toString('utf8'),
        ts.ScriptTarget.Latest,
        true
      );

      const foundExpressions = findPrefixUnaryExpressions(sourceFile);
      if (!foundExpressions.length) {
        return;
      }

      foundExpressions.forEach((expr) => {
        updater.remove(expr.getStart(), 1);
        updater.insertLeft(expr.getStart(), 'parseFloat(');
        updater.insertRight(expr.getEnd(), ')');
      });
      tree.commitUpdate(updater);
    };

    tree.visit(fileVisitor);
    return tree;
  };
}
function findPrefixUnaryExpressions(sourceFile: ts.SourceFile) {
  let foundNodes: ts.PrefixUnaryExpression[] = [];

  sourceFile.forEachChild(function nodeVisitor(node) {
    if (ts.isPrefixUnaryExpression(node)) {
      if (node.getFullText(sourceFile).trim().startsWith('+')) {
        foundNodes.push(node);
      }
    }

    node.forEachChild(nodeVisitor);
  });

  return foundNodes;
}
