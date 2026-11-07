/**
 * Per-project default agent preset, browser half. Two registrations over one
 * shared controller: a row in each session's "..." menu that opens the project
 * default dialog, and the dialog itself in the frame-wide overlay layer so it
 * outlives the row menu. Both appear only while the Host serves this plugin's
 * settings namespace, so a deployment without the Host half shows no trace.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type ProjectDefaultModeKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Per-project default-mode copy. */
        'projectDefaultMode': ProjectDefaultModeKey;
    }
}
export type { ProjectDefaultMenuInjected, ProjectDefaultMenuProps, ProjectDefaultDialogInjected, ProjectDefaultDialogProps } from './ProjectDefault.tsx';
export type { ProjectDefaultOption, ProjectDefaultState } from './controller.ts';
export { PROJECT_DEFAULT_MODE_NS, ProjectDefaultController, ruleForWorkspace, withRule } from './controller.ts';
export type { ProjectDefaultModeKey } from './locales.ts';
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the menu row and dialog while the Host serves the rules namespace.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map