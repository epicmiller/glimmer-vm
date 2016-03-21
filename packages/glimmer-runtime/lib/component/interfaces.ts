import { EvaluatedArgs } from '../compiled/expressions/args';
import { FunctionExpression } from '../compiled/expressions/function';
import { Layout, CompiledBlock } from '../compiled/blocks';

import Environment, { DynamicScope } from '../environment';
import { ElementOperations } from '../builder';

import { Opaque } from 'glimmer-util';
import { Destroyable } from 'glimmer-reference';

export type Component = Opaque;
export type ComponentClass = any;

export interface ComponentManager<T> {
  // First, the component manager is asked to create a bucket of state for
  // the supplied attributes. From the perspective of Glimmer, this is
  // an opaque token, but in practice it is probably a component object.
  create(definition: ComponentDefinition<T>, attrs: EvaluatedArgs, dynamicScope: DynamicScope): T;

  // Next, Glimmer asks the manager for the `self` it should use in the
  // layout. This will likely be the component itself, but may not be.
  getSelf(component: T): any;

  // The `didCreateElement` hook is meant to be used by the host to save
  // off the element. Hosts should use `didCreate`, which runs asynchronously
  // after the rendering process, to provide hooks for user code.
  didCreateElement(component: T, element: Element, operations: ElementOperations);

  // Once the whole top-down rendering process is complete, Glimmer invokes
  // the `didCreate` callbacks.
  didCreate(component: T);

  // When the input attributes have changed, and top-down revalidation has
  // begun, the manager's `update` hook is called.
  update(component: T, attrs: EvaluatedArgs, dynamicScope: DynamicScope);

  // Finally, once top-down revalidation has completed, Glimmer invokes
  // the `didUpdate` callbacks on components that changed.
  didUpdate(component: T);

  // Convert the opaque component into an object that implements Destroyable.
  // If it returns null, the component will not be destroyed.
  getDestructor(component: T): Destroyable;
}

export interface ComponentLayoutBuilder {
  env: Environment;
  tag: ComponentTagBuilder;
  attrs: ComponentAttrsBuilder;

  wrapLayout(layout: Layout);
  fromLayout(layout: Layout);
}

export interface ComponentTagBuilder {
  static(tagName: string);
  dynamic(tagName: FunctionExpression<string>);
}

export interface ComponentAttrsBuilder {
  static(name: string, value: string);
  dynamic(name: string, value: FunctionExpression<string>);
}

export const CACHED_LAYOUT = "CACHED_LAYOUT [d990e194-8529-4f3b-8ee9-11c58a70f7a4]";

export abstract class ComponentDefinition<T> {
  public name: string; // for debugging
  public manager: ComponentManager<T>;
  public ComponentClass: ComponentClass;

  private "CACHED_LAYOUT [d990e194-8529-4f3b-8ee9-11c58a70f7a4]": CompiledBlock = null;

  constructor(name: string, manager: ComponentManager<T>, ComponentClass: ComponentClass) {
    this.name = name;
    this.manager = manager;
    this.ComponentClass = ComponentClass;
  }

  protected abstract compile(builder: ComponentLayoutBuilder);
}
