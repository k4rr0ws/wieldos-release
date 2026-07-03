import { a9 as escape_html, a0 as attr, _ as ensure_array_like } from './server.js-BeDXxHyW.js';
import { I as Input } from './input.js-VxJyhIEJ.js';
import { L as Label } from './label.js-C7a3GAk3.js';
import { N as Native_select } from './native-select.js-BcwRQfN8.js';
import { T as Textarea } from './textarea.js-OJ5frhCS.js';

//#region src/lib/components/agent-fields.svelte
function Agent_fields($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { agent = null, toolCatalog = [], message = "" } = $$props;
		function initials(name) {
			return name?.trim()?.slice(0, 2)?.toUpperCase() ?? "?";
		}
		function agentHasTool(a, id) {
			const lower = id.toLowerCase();
			return (a?.tools ?? []).some((t) => t.toLowerCase() === lower);
		}
		$$renderer.push(`<div class="grid gap-2">`);
		Label($$renderer, {
			for: "name",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Name`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: "name",
			name: "name",
			value: agent?.name ?? "",
			placeholder: "Daedalus",
			required: true
		});
		$$renderer.push(`<!----> `);
		if (message) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-destructive text-xs">${escape_html(message)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
		Label($$renderer, {
			for: "title",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Title`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: "title",
			name: "title",
			value: agent?.title ?? "",
			placeholder: "Systems Architect"
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "status",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Status`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Native_select($$renderer, {
			id: "status",
			name: "status",
			value: agent?.status ?? "active",
			class: "w-full",
			children: ($$renderer) => {
				$$renderer.option({ value: "active" }, ($$renderer) => {
					$$renderer.push(`Active`);
				});
				$$renderer.push(` `);
				$$renderer.option({ value: "inactive" }, ($$renderer) => {
					$$renderer.push(`Inactive`);
				});
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "description",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Description`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "description",
			name: "description",
			value: agent?.description ?? "",
			placeholder: "What this agent does.",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "avatarFile",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Avatar`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="flex items-center gap-3"><div class="bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">`);
		if (agent?.avatar && agent.avatar.length <= 4) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-2xl">${escape_html(agent.avatar)}</span>`);
		} else if (agent?.avatar) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<img${attr("src", agent.avatar)} alt="" class="size-12 object-cover"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-muted-foreground text-sm font-medium">${escape_html(initials(agent?.name ?? ""))}</span>`);
		}
		$$renderer.push(`<!--]--></div> `);
		Input($$renderer, {
			id: "avatarFile",
			name: "avatarFile",
			type: "file",
			accept: "image/png,image/jpeg,image/gif,image/webp,image/svg+xml",
			class: "cursor-pointer"
		});
		$$renderer.push(`<!----></div> <input type="hidden" name="currentAvatar"${attr("value", agent?.avatar ?? "")}/> `);
		Input($$renderer, {
			name: "avatar",
			value: agent?.avatar && agent.avatar.startsWith("/media/avatars/") ? "" : agent?.avatar ?? "",
			placeholder: "…or an emoji / image URL"
		});
		$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Upload an image (max 5 MB), or use an emoji / image URL.</p></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "persona",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Persona`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "persona",
			name: "persona",
			value: agent?.persona ?? "",
			placeholder: "How this agent thinks and behaves.",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
		Label($$renderer, {
			for: "beliefs",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Beliefs`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "beliefs",
			name: "beliefs",
			value: agent?.beliefs ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "motivations",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Motivations`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "motivations",
			name: "motivations",
			value: agent?.motivations ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
		Label($$renderer, {
			for: "communicationStyle",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Communication style`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "communicationStyle",
			name: "communicationStyle",
			value: agent?.communicationStyle ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "decisionStyle",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Decision style`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "decisionStyle",
			name: "decisionStyle",
			value: agent?.decisionStyle ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "background",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Background`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "background",
			name: "background",
			value: agent?.background ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
		Label($$renderer, {
			for: "experience",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Experience`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "experience",
			name: "experience",
			value: agent?.experience ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "specialization",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Specialization`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "specialization",
			name: "specialization",
			value: agent?.specialization ?? "",
			rows: 2
		});
		$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "skills",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Skills`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "skills",
			name: "skills",
			value: agent ? agent.skills.join(", ") : "",
			placeholder: "Solidity, React, AI Systems",
			rows: 2
		});
		$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Separate with commas or new lines.</p></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: "strengths",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Strengths`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Textarea($$renderer, {
			id: "strengths",
			name: "strengths",
			value: agent ? agent.strengths.join(", ") : "",
			placeholder: "Architecture, Debugging, Pattern Recognition",
			rows: 2
		});
		$$renderer.push(`<!----></div> <div class="grid gap-2">`);
		Label($$renderer, {
			children: ($$renderer) => {
				$$renderer.push(`<!---->Tools`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Enable the capabilities this agent can use when dispatched. Reading your own data is always
		available.</p> <div class="grid gap-2 sm:grid-cols-2"><!--[-->`);
		const each_array = ensure_array_like(toolCatalog);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tool = each_array[$$index];
			$$renderer.push(`<label class="hover:bg-muted/50 flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5"><input type="checkbox" name="tools"${attr("value", tool.id)}${attr("checked", agentHasTool(agent, tool.id), true)} class="accent-primary mt-0.5 size-4"/> <span class="grid gap-0.5"><span class="text-sm font-medium">${escape_html(tool.id)}</span> <span class="text-muted-foreground text-xs">${escape_html(tool.description)}</span></span></label>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { Agent_fields as A };
//# sourceMappingURL=agent-fields.js-TdLtRcnF.js.map
