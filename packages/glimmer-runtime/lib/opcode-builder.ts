import {
  ComponentDefinition
} from './component/interfaces';

import {
  FunctionExpression
} from './compiled/expressions/function';

import {
  Args
} from './syntax/core';

import { BaselineSyntax } from './scanner';

import { SymbolTable } from 'glimmer-interfaces';

import {
  Opaque
} from 'glimmer-util';

import * as WireFormat from 'glimmer-wire-format';

export type StaticDefinition = ComponentDefinition<Opaque>;
export type DynamicDefinition = FunctionExpression<ComponentDefinition<Opaque>>;

export interface ComponentBuilder {
  static(definition: ComponentDefinition<Opaque>, args: BaselineSyntax.Args, symbolTable: SymbolTable, shadow?: string[]);
  dynamic(definitionArgs: BaselineSyntax.Args, definition: DynamicDefinition, args: BaselineSyntax.Args, symbolTable: SymbolTable, shadow?: string[]);
}
