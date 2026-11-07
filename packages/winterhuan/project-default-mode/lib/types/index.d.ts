/**
 * Per-project default agent preset, Host half.
 *
 * DSH resolves one global default preset for a session that names none
 * (`agentPresets.defaultId`). This plugin adds a per-project override: a rule
 * maps a Workspace identity to an agent preset, and a blank session created
 * under that Workspace composes the rule's preset instead of the global default.
 *
 * The override rides the same seam the new-session hero chip uses — the preset
 * registry's `select`, which mounts the preset revision and appends an
 * `agent-preset/selected` Session event — so the composition a session actually
 * runs is recorded in its log, as the model-visible-implies-logged rule
 * requires. `select` recomposes a published Agent, so the switch runs once the
 * serial `agent/created` dispatch has settled and before the first turn. Only a
 * fresh ordinary session (or a blank session another surface falls back to the
 * global default) is retargeted; a forked or subagent child keeps the
 * composition its lineage already carries, a session whose first turn already
 * started keeps the composition its log fixed, and a request that names a
 * preset other than the global default wins. A request that names the global
 * default explicitly is indistinguishable from an omission and is retargeted
 * like one.
 *
 * DSH reuses a live blank session by selecting the global default onto it when
 * the web client opens its workspace without naming a preset. That selection
 * lands after `agent/created` settled and would silently undo the project
 * default before the first turn, so the Host also watches `agent-preset/selected`
 * events and re-asserts the rule on a blank session that falls back to the
 * global default.
 *
 * This module owns no Remote namespace: rules are ordinary volatile Config the
 * browser half edits through the settings form, and the Host reads them at
 * creation.
 *
 * @module @winterhuan/dsh-project-default-mode
 */
import type { Context, Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { ProjectDefaultRule } from './types.ts';
export type { ProjectDefaultRule } from './types.ts';
/** Plugin identity and the settings namespace the browser half writes rules to. */
export declare const name = "project-default-mode";
/**
 * No hard dependencies: the preset registry, Workspace registry, and projection
 * registry are all read optionally through `ctx.get`, so the plugin activates
 * without them and simply does nothing until they are present.
 */
export declare const inject: string[];
/** Per-project default presets, edited live from the settings form without remounting. */
export interface Config {
    /** Rules over Workspace identities; the last rule for a Workspace wins. */
    readonly rules: Volatile<ProjectDefaultRule[]>;
}
/**
 * Config schema. `rules` is volatile so the browser half edits it through the
 * settings form and the running Host observes the change without remounting.
 */
export declare const Config: z<Config>;
/**
 * Install the creation-time override for this plugin's lifetime.
 * @param context - Host context carrying the Agent, Workspace, and preset services.
 * @param config - per-project default rules.
 */
export declare function apply(context: Context, config: Config): void;
/**
 * Select the effective rule for one Workspace: the last matching entry, so a
 * later edit supersedes an earlier rule for the same project.
 * @param rules - configured per-project defaults.
 * @param workspaceId - resolved Workspace identity.
 * @returns the winning rule, or undefined when the Workspace has none.
 */
export declare function ruleForWorkspace(rules: readonly ProjectDefaultRule[], workspaceId: string): ProjectDefaultRule | undefined;
//# sourceMappingURL=index.d.ts.map