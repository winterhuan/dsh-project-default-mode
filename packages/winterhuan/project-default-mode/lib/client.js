window.__ModuleLoader__.load({
	id: "@winterhuan/dsh-project-default-mode",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region lib/types/client/controller.js
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
		/** Settings namespace of the Host plugin, whose `rules` field this controller edits. */
		const PROJECT_DEFAULT_MODE_NS = "project-default-mode";
		const INITIAL = {
			open: false,
			status: "loading",
			error: null,
			saving: false,
			workspace: null,
			options: [],
			selected: void 0,
			current: void 0
		};
		/** Resolves the opened session's project, reads the roster, and stages its default. */
		var ProjectDefaultController = class {
			ctx;
			/** Observable dialog state; the menu item and the dialog share this one handle. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(INITIAL);
			form;
			loadGeneration = 0;
			/** Releases the wait for the settings form; set only while an open is waiting on it. */
			releaseForm;
			/** @param ctx - browser plugin context carrying the Workspace list, remotes, and config forms. */
			constructor(ctx) {
				this.ctx = ctx;
				this.form = ctx.configForms.get(PROJECT_DEFAULT_MODE_NS);
			}
			set(patch) {
				this.store.set({
					...this.store.getSnapshot(),
					...patch
				});
			}
			/**
			* Open the dialog for one session: resolve its Workspace, wait for the
			* settings form's first accepted section, and load the roster. A newer open
			* supersedes an in-flight read. A session outside any Workspace still opens,
			* with `workspace` null and nothing to save.
			* @param sessionId - the session whose project default is edited.
			*/
			async open(sessionId) {
				const generation = ++this.loadGeneration;
				this.releaseForm?.();
				const workspace = this.workspaceFor(sessionId);
				this.set({
					...INITIAL,
					open: true,
					workspace
				});
				try {
					await this.formSettled();
					if (generation !== this.loadGeneration) return;
					const rules = this.form.getSnapshot().value?.rules ?? [];
					const current = workspace === null ? void 0 : ruleForWorkspace(rules, workspace.workspaceId);
					this.set({
						current,
						selected: current
					});
					const result = await this.ctx.remote.agentPresets.list();
					if (generation !== this.loadGeneration) return;
					if (!result.ok) throw new Error(result.error.message);
					const options = result.value.presets.map((preset) => ({
						preset: preset.id,
						label: preset.name ?? preset.id,
						isGlobalDefault: preset.isDefault
					}));
					this.set({
						status: "ready",
						options
					});
				} catch (error) {
					if (generation !== this.loadGeneration) return;
					this.set({
						status: "error",
						error: error instanceof Error ? error.message : String(error)
					});
				}
			}
			/**
			* Stage one choice without writing.
			* @param preset - the selected preset id, or undefined for follow-global.
			*/
			select(preset) {
				this.set({ selected: preset });
			}
			/**
			* Persist the staged choice for the opened Workspace. Follow-global removes
			* the Workspace's rule; a preset adds or replaces it. A successful save closes
			* the dialog; a refusal keeps it open and reports the failure. Nothing is
			* written while the form has no accepted section.
			* @returns whether the Host accepted the write.
			*/
			async save() {
				const state = this.store.getSnapshot();
				if (state.workspace === null || state.saving) return false;
				const snapshot = this.form.getSnapshot();
				if (snapshot.status !== "ready") {
					this.set({ error: `settings form is ${snapshot.status}` });
					return false;
				}
				this.set({
					saving: true,
					error: null
				});
				try {
					const rules = withRule(snapshot.value?.rules ?? [], state.workspace.workspaceId, state.selected);
					const accepted = await this.form.set("rules", rules);
					if (accepted) this.close();
					else this.set({ error: "refused" });
					return accepted;
				} catch (error) {
					this.set({ error: error instanceof Error ? error.message : String(error) });
					return false;
				} finally {
					this.set({ saving: false });
				}
			}
			/** Close the dialog and drop its staged state; an in-flight load or form wait is superseded. */
			close() {
				this.loadGeneration++;
				this.releaseForm?.();
				this.store.set(INITIAL);
			}
			/**
			* Resolve once the settings form has left its initial `loading` state (its
			* first accepted section, or `unavailable`), or as soon as the dialog closes
			* or a newer open supersedes this one.
			* @returns resolution when the form has settled or the wait was released.
			*/
			formSettled() {
				if (this.form.getSnapshot().status !== "loading") return Promise.resolve();
				return new Promise((resolve) => {
					const off = this.form.subscribe(() => {
						if (this.form.getSnapshot().status !== "loading") this.releaseForm?.();
					});
					this.releaseForm = () => {
						this.releaseForm = void 0;
						off();
						resolve();
					};
				});
			}
			/** The Workspace accounting for a session, from the client Workspace snapshot. */
			workspaceFor(sessionId) {
				return this.ctx.workspaces.list.getSnapshot().items.find((workspace) => workspace.sessionIds.includes(sessionId)) ?? null;
			}
		};
		/**
		* The effective rule for one Workspace: the last matching entry wins, matching
		* the Host's own resolution.
		* @param rules - configured per-project defaults.
		* @param workspaceId - Workspace identity to look up.
		* @returns its rule's preset, or undefined when it follows the global default.
		*/
		function ruleForWorkspace(rules, workspaceId) {
			let found;
			for (const rule of rules) if (rule.workspaceId === workspaceId) found = rule.agentPreset;
			return found;
		}
		/**
		* Replace a Workspace's rule in a fresh array: a preset adds or updates its
		* entry, and undefined removes it. Other Workspaces' rules keep their order.
		* @param rules - current per-project defaults.
		* @param workspaceId - Workspace being edited.
		* @param preset - the chosen preset, or undefined to follow the global default.
		* @returns the next rules array.
		*/
		function withRule(rules, workspaceId, preset) {
			const without = rules.filter((rule) => rule.workspaceId !== workspaceId);
			return preset === void 0 ? without : [...without, {
				workspaceId,
				agentPreset: preset
			}];
		}
		//#endregion
		//#region \0dsh-css:/Users/winter/dsh-creative/plugins/dsh-project-default-mode/packages/winterhuan/project-default-mode/src/client/dialog.module.css.mjs
		const css = ".El9Exa_hint{color:var(--dsw-alias-label-tertiary);font-size:var(--dsw-font-size-sm);margin:0 0 12px;line-height:1.5}.El9Exa_status{color:var(--dsw-alias-label-tertiary);font-size:var(--dsw-font-size-sm);margin:0}.El9Exa_options{border:none;flex-direction:column;gap:4px;margin:0;padding:0;display:flex}.El9Exa_option{border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);font-size:var(--dsw-font-size-sm);cursor:pointer;align-items:center;gap:8px;padding:8px 10px;display:flex}.El9Exa_option:hover{background:var(--dsw-alias-fill-hover)}.El9Exa_option input{accent-color:var(--dsw-alias-button-primary-fill);margin:0}.El9Exa_badge{color:var(--dsw-alias-label-quaternary);font-size:var(--dsw-font-size-xs);margin-left:auto}.El9Exa_error{color:var(--dsw-alias-state-error-label);font-size:var(--dsw-font-size-sm);margin-top:12px}";
		const tagId = "@winterhuan/dsh-project-default-mode/dialog.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@winterhuan/dsh-project-default-mode";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var dialog_module_css_default = {
			"badge": "El9Exa_badge",
			"error": "El9Exa_error",
			"hint": "El9Exa_hint",
			"option": "El9Exa_option",
			"options": "El9Exa_options",
			"status": "El9Exa_status"
		};
		//#endregion
		//#region lib/types/client/ProjectDefault.js
		/**
		* The menu item and dialog for one session's project default mode.
		*
		* The menu row lives in `sidebar.workspaces.session.menu.item` and only raises
		* the open request with the row's session; the dialog lives in `shell.overlay`
		* so it outlives the row menu that opened it, the same split the shipped rename
		* and archive actions use. Both read the shared controller store through their
		* injected faces, so one handle serves any session.
		*/
		/**
		* Menu row (order 500): open the project default dialog for this session.
		* @param props - owner share, menu open state, the open callback, and the locale seat.
		* @returns the row.
		*/
		function ProjectDefaultMenuItem({ sessionId, useMenuOpenState, open, t }) {
			const [, setMenuOpen] = useMenuOpenState();
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MenuItemButton, {
				icon: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSettingsOutlineRegular, {}),
				onSelect: () => {
					setMenuOpen(false);
					open(sessionId);
				},
				children: t("menu")
			});
		}
		/**
		* The dialog: nothing while closed, otherwise one project's mode picker. A save
		* refusal keeps the dialog open with the failure notice; a session outside any
		* registered Workspace shows the hint but offers nothing to save.
		* @param props - the shared state hook, its actions, and the locale seat.
		* @returns the open dialog, or null while closed.
		*/
		function ProjectDefaultDialog({ useProjectDefault, select, save, close, t }) {
			const state = useProjectDefault((current) => current);
			if (!state.open) return null;
			const disabled = state.saving || state.status !== "ready" || state.workspace === null;
			return (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: close,
				closeLabel: t("close"),
				title: t("title", { project: state.workspace?.title ?? "" }),
				footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					disabled: state.saving,
					onClick: close,
					children: t("cancel")
				}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "primary",
					disabled,
					onClick: () => {
						save();
					},
					children: state.saving ? t("saving") : t("save")
				})] }),
				children: [
					(0, react_jsx_runtime.jsx)("p", {
						className: dialog_module_css_default.hint,
						children: t("hint")
					}),
					state.status === "loading" && (0, react_jsx_runtime.jsx)("p", {
						className: dialog_module_css_default.status,
						children: t("loading")
					}),
					state.status === "error" && (0, react_jsx_runtime.jsx)("div", {
						className: dialog_module_css_default.error,
						role: "alert",
						children: t("loadFailed")
					}),
					state.status === "ready" && state.workspace !== null && (0, react_jsx_runtime.jsxs)("fieldset", {
						className: dialog_module_css_default.options,
						disabled: state.saving,
						children: [(0, react_jsx_runtime.jsxs)("label", {
							className: dialog_module_css_default.option,
							children: [
								(0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "project-default-mode",
									checked: state.selected === void 0,
									onChange: () => {
										select(void 0);
									}
								}),
								(0, react_jsx_runtime.jsx)("span", { children: t("followGlobal") }),
								state.current === void 0 && (0, react_jsx_runtime.jsx)("span", {
									className: dialog_module_css_default.badge,
									children: t("globalDefault")
								})
							]
						}), state.options.map((option) => (0, react_jsx_runtime.jsxs)("label", {
							className: dialog_module_css_default.option,
							children: [
								(0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "project-default-mode",
									checked: state.selected === option.preset,
									onChange: () => {
										select(option.preset);
									}
								}),
								(0, react_jsx_runtime.jsx)("span", { children: option.label }),
								option.isGlobalDefault && (0, react_jsx_runtime.jsx)("span", {
									className: dialog_module_css_default.badge,
									children: t("globalDefault")
								})
							]
						}, option.preset))]
					}),
					state.status === "ready" && state.error !== null && (0, react_jsx_runtime.jsx)("div", {
						className: dialog_module_css_default.error,
						role: "alert",
						children: t("saveFailed")
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** Copy owned by the per-project default-mode menu item and its dialog. */
		/** English copy. */
		const en = {
			menu: "Set project default mode",
			title: "Default mode for {project}",
			followGlobal: "Follow the global default",
			globalDefault: "Global default",
			hint: "New sessions in this project start in the selected mode. Sessions already started keep their own mode, and picking a mode on the new-session screen still overrides this for that session.",
			loading: "Loading…",
			loadFailed: "Could not load the available modes.",
			saveFailed: "Could not save the project default.",
			save: "Save",
			saving: "Saving…",
			cancel: "Cancel",
			close: "Close"
		};
		/** Chinese copy. */
		const zh = {
			menu: "设为本项目默认模式",
			title: "「{project}」的默认模式",
			followGlobal: "跟随全局默认",
			globalDefault: "全局默认",
			hint: "本项目新建的会话将以所选模式开始。已经开始的会话保留各自模式；在新建会话界面手动选择的模式仍会对那一个会话覆盖此设置。",
			loading: "加载中…",
			loadFailed: "无法加载可用模式。",
			saveFailed: "无法保存项目默认模式。",
			save: "保存",
			saving: "保存中…",
			cancel: "取消",
			close: "关闭"
		};
		//#endregion
		//#region lib/types/client/index.js
		/**
		* Per-project default agent preset, browser half. Two registrations over one
		* shared controller: a row in each session's "..." menu that opens the project
		* default dialog, and the dialog itself in the frame-wide overlay layer so it
		* outlives the row menu. Both appear only while the Host serves this plugin's
		* settings namespace, so a deployment without the Host half shows no trace.
		*/
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"workspaces",
			"remote",
			"remote.agentPresets",
			"configForms"
		];
		/**
		* Mount the menu row and dialog while the Host serves the rules namespace.
		* @param ctx - the browser plugin context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("projectDefaultMode", {
				zh,
				en
			}), "project-default-mode: dictionaries");
			const controller = new ProjectDefaultController(ctx);
			ctx.effect(() => ctx.configForms.whileServed([PROJECT_DEFAULT_MODE_NS], () => {
				const menu = ctx.slots.inject("sidebar.workspaces.session.menu.item", () => ctx.slots.register({
					name: "sidebar.workspaces.session.menu.item",
					id: "project-default-mode",
					order: 500,
					locale: "projectDefaultMode",
					inject: () => ({ open: (sessionId) => {
						controller.open(sessionId);
					} })
				}, ProjectDefaultMenuItem));
				const dialog = ctx.slots.inject("shell.overlay", () => ctx.slots.register({
					name: "shell.overlay",
					id: "project-default-mode",
					locale: "projectDefaultMode",
					inject: () => ({
						hooks: { projectDefault: controller.store },
						select: (preset) => {
							controller.select(preset);
						},
						save: () => controller.save(),
						close: () => {
							controller.close();
						}
					})
				}, ProjectDefaultDialog));
				return () => {
					controller.close();
					menu();
					dialog();
				};
			}), "project-default-mode: surfaces");
		}
		//#endregion
		exports.PROJECT_DEFAULT_MODE_NS = PROJECT_DEFAULT_MODE_NS;
		exports.ProjectDefaultController = ProjectDefaultController;
		exports.apply = apply;
		exports.inject = inject;
		exports.ruleForWorkspace = ruleForWorkspace;
		exports.withRule = withRule;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map