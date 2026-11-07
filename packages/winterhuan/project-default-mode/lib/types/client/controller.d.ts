/**
 * Dialog controller for the per-project default mode.
 *
 * One instance is owned by the plugin's apply closure and shared by the menu
 * item and the dialog through its stable store, so the dialog can open for any
 * session without a per-request registration. Opening resolves the Workspace
 * that accounts for the session, reads the preset roster, and stages the
 * project's current default. Saving replaces the whole `rules` field of the Host
 * namespace through the settings form: every other project's rule is preserved,
 * and the form carries the namespace revision fence and recovers its mirror on a
 * refusal.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { WorkspaceView } from '@deepseek-ai/dsh-api-workspace-controller/client';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { ProjectDefaultRule } from '../types.ts';
/** Settings namespace of the Host plugin, whose `rules` field this controller edits. */
export declare const PROJECT_DEFAULT_MODE_NS = "project-default-mode";
/** One selectable mode: a preset, or following the global default. */
export interface ProjectDefaultOption {
    /** Preset id, or `undefined` for the follow-global choice. */
    readonly preset: string | undefined;
    /** Display label: the preset's own published name, or its id. */
    readonly label: string;
    /** Whether the deployment resolves this preset as the global default. */
    readonly isGlobalDefault: boolean;
}
/** The dialog state as the component renders it. */
export interface ProjectDefaultState {
    /** Whether the dialog is showing. */
    open: boolean;
    status: 'loading' | 'ready' | 'error';
    error: string | null;
    saving: boolean;
    /** Workspace the opened session belongs to; null outside any registered Workspace. */
    workspace: WorkspaceView | null;
    /** Available modes, without the follow-global choice the dialog adds itself. */
    options: readonly ProjectDefaultOption[];
    /** The staged choice: a preset id, or undefined for follow-global. */
    selected: string | undefined;
    /** The rule the Workspace carried at open; the dialog marks it as the project's current mode. */
    current: string | undefined;
}
/** Resolves the opened session's project, reads the roster, and stages its default. */
export declare class ProjectDefaultController {
    private readonly ctx;
    /** Observable dialog state; the menu item and the dialog share this one handle. */
    readonly store: SnapshotStore<ProjectDefaultState>;
    private readonly form;
    private loadGeneration;
    /** Releases the wait for the settings form; set only while an open is waiting on it. */
    private releaseForm;
    /** @param ctx - browser plugin context carrying the Workspace list, remotes, and config forms. */
    constructor(ctx: ClientContext);
    private set;
    /**
     * Open the dialog for one session: resolve its Workspace, wait for the
     * settings form's first accepted section, and load the roster. A newer open
     * supersedes an in-flight read. A session outside any Workspace still opens,
     * with `workspace` null and nothing to save.
     * @param sessionId - the session whose project default is edited.
     */
    open(sessionId: SessionId): Promise<void>;
    /**
     * Stage one choice without writing.
     * @param preset - the selected preset id, or undefined for follow-global.
     */
    select(preset: string | undefined): void;
    /**
     * Persist the staged choice for the opened Workspace. Follow-global removes
     * the Workspace's rule; a preset adds or replaces it. A successful save closes
     * the dialog; a refusal keeps it open and reports the failure. Nothing is
     * written while the form has no accepted section.
     * @returns whether the Host accepted the write.
     */
    save(): Promise<boolean>;
    /** Close the dialog and drop its staged state; an in-flight load or form wait is superseded. */
    close(): void;
    /**
     * Resolve once the settings form has left its initial `loading` state (its
     * first accepted section, or `unavailable`), or as soon as the dialog closes
     * or a newer open supersedes this one.
     * @returns resolution when the form has settled or the wait was released.
     */
    private formSettled;
    /** The Workspace accounting for a session, from the client Workspace snapshot. */
    private workspaceFor;
}
/**
 * The effective rule for one Workspace: the last matching entry wins, matching
 * the Host's own resolution.
 * @param rules - configured per-project defaults.
 * @param workspaceId - Workspace identity to look up.
 * @returns its rule's preset, or undefined when it follows the global default.
 */
export declare function ruleForWorkspace(rules: readonly ProjectDefaultRule[], workspaceId: string): string | undefined;
/**
 * Replace a Workspace's rule in a fresh array: a preset adds or updates its
 * entry, and undefined removes it. Other Workspaces' rules keep their order.
 * @param rules - current per-project defaults.
 * @param workspaceId - Workspace being edited.
 * @param preset - the chosen preset, or undefined to follow the global default.
 * @returns the next rules array.
 */
export declare function withRule(rules: readonly ProjectDefaultRule[], workspaceId: string, preset: string | undefined): ProjectDefaultRule[];
//# sourceMappingURL=controller.d.ts.map