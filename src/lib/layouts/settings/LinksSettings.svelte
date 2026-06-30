<script lang="ts">
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon'
  import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon'
  import DotsSixVerticalIcon from 'phosphor-svelte/lib/DotsSixVerticalIcon'
  import CheckIcon from 'phosphor-svelte/lib/CheckIcon'
  import XIcon from 'phosphor-svelte/lib/XIcon'
  import { settings } from '../../state/settings.svelte'
  import { normalizeUrl, hostname, sortLinks, LINK_SORTS, type QuickLink } from '../../utils/links'
  import { Checkbox } from '../../components'

  let label = $state('')
  let url = $state('')

  // Inline editing of an existing link.
  let editingId = $state<string | null>(null)
  let editLabel = $state('')
  let editUrl = $state('')

  // Drag-and-drop reordering, by id of the link being dragged.
  let dragId = $state<string | null>(null)

  // Links shown here in the same order the dashboard uses.
  let orderedLinks = $derived(sortLinks(settings.quickLinks, settings.linkSort))
  // Manual reordering only applies to the custom (manual) order.
  let canReorder = $derived(settings.linkSort === 'custom')

  function add(e: SubmitEvent) {
    e.preventDefault()
    const href = normalizeUrl(url)
    if (!href) return
    settings.quickLinks.push({
      id: crypto.randomUUID(),
      label: label.trim() || hostname(href),
      url: href,
      addedAt: Date.now(),
    })
    label = ''
    url = ''
  }

  function remove(id: string) {
    const i = settings.quickLinks.findIndex((link) => link.id === id)
    if (i !== -1) settings.quickLinks.splice(i, 1)
    if (editingId === id) editingId = null
  }

  function startEdit(link: QuickLink) {
    editingId = link.id
    editLabel = link.label
    editUrl = link.url
  }

  function saveEdit(e: SubmitEvent) {
    e.preventDefault()
    const link = settings.quickLinks.find((l) => l.id === editingId)
    if (link) {
      const href = normalizeUrl(editUrl)
      if (!href) return
      link.url = href
      link.label = editLabel.trim() || hostname(href)
    }
    editingId = null
  }

  function cancelEdit() {
    editingId = null
  }

  function onDragOver(e: DragEvent) {
    // Allow a drop while a reorder is in progress.
    if (dragId !== null) e.preventDefault()
  }

  function onDrop(targetId: string) {
    const links = settings.quickLinks
    if (dragId === null || dragId === targetId) {
      dragId = null
      return
    }
    const from = links.findIndex((l) => l.id === dragId)
    const to = links.findIndex((l) => l.id === targetId)
    if (from !== -1 && to !== -1) {
      const [moved] = links.splice(from, 1)
      links.splice(to, 0, moved)
    }
    dragId = null
  }
</script>


<div class="links-settings">
  <section class="links-visibility">
    <Checkbox bind:checked={settings.showLinks}>Show links</Checkbox>
  </section>

  <section class="links-list">
    <h2 class="section-title">Your links</h2>

    {#if settings.quickLinks.length > 0}
      <label class="sort">
        <span class="sort__label">Sort</span>
        <select class="sort__select" bind:value={settings.linkSort}>
          {#each LINK_SORTS as opt (opt.id)}
            <option value={opt.id}>{opt.label}</option>
          {/each}
        </select>
      </label>

      <ul class="links">
        {#each orderedLinks as link (link.id)}
          <li
            class="link"
            class:link--dragging={dragId === link.id}
            draggable={canReorder && editingId !== link.id}
            ondragstart={() => (dragId = link.id)}
            ondragover={onDragOver}
            ondrop={() => onDrop(link.id)}
            ondragend={() => (dragId = null)}
          >
            {#if editingId === link.id}
              <form class="link__edit" onsubmit={saveEdit}>
                <input
                  class="input"
                  type="text"
                  placeholder="Label (optional)"
                  bind:value={editLabel}
                />
                <input
                  class="input"
                  type="text"
                  inputmode="url"
                  placeholder="example.com"
                  bind:value={editUrl}
                  required
                />
                <div class="link__actions">
                  <button type="submit" class="icon-button" aria-label="Save" title="Save">
                    <CheckIcon />
                  </button>
                  <button
                    type="button"
                    class="icon-button"
                    onclick={cancelEdit}
                    aria-label="Cancel"
                    title="Cancel"
                  >
                    <XIcon />
                  </button>
                </div>
              </form>
            {:else}
              {#if canReorder}
                <span class="link__handle" aria-hidden="true" title="Drag to reorder">
                  <DotsSixVerticalIcon />
                </span>
              {/if}
              <span class="link__text">
                <span class="link__label">{link.label}</span>
                <span class="link__url">{hostname(link.url)}</span>
              </span>
              <button
                type="button"
                class="icon-button"
                onclick={() => startEdit(link)}
                aria-label={`Edit ${link.label}`}
                title="Edit"
              >
                <PencilSimpleIcon />
              </button>
              <button
                type="button"
                class="icon-button"
                onclick={() => remove(link.id)}
                aria-label={`Remove ${link.label}`}
                title="Remove"
              >
                <TrashIcon />
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">No links yet. Add one below to show it on your dashboard.</p>
    {/if}
  </section>

  <section class="links-add">
    <h2 class="section-title">Add a link</h2>
    <form class="form" onsubmit={add}>
      <input
        class="input"
        type="text"
        placeholder="Label (optional)"
        bind:value={label}
      />
      <input
        class="input"
        type="text"
        inputmode="url"
        placeholder="example.com"
        bind:value={url}
        required
      />
      <button class="add" type="submit">Add link</button>
    </form>
  </section>
</div>


<style>
  .links-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }

  .links-visibility,
  .links-list,
  .links-add {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    color: var(--color-foreground-subtle);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .sort {
    align-items: center;
    display: flex;
    font-size: 0.8125rem;
    gap: 0.5rem;
    opacity: 0.8;
  }

  .sort__select {
    background: transparent;
    border: 1px solid var(--color-slate-80);
    border-radius: 0.375rem;
    color: inherit;
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.25rem 0.5rem;
  }

  .sort__select:focus {
    border-color: var(--color-lime-50);
    outline: none;
  }

  .empty {
    font-size: 0.9375rem;
    opacity: 0.6;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
  }

  .link {
    align-items: center;
    border: 1px solid var(--color-slate-80);
    border-radius: 0.5rem;
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .link[draggable='true'] {
    cursor: grab;
  }

  .link--dragging {
    opacity: 0.5;
  }

  .link__handle {
    display: inline-flex;
    flex-shrink: 0;
    opacity: 0.5;
  }

  .link__handle :global(svg) {
    fill: currentColor;
    height: 1.25rem;
    width: 1.25rem;
  }

  .link__edit {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .link__actions {
    display: flex;
    gap: 0.5rem;
  }

  .link__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .link__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link__url {
    font-size: 0.8125rem;
    opacity: 0.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    opacity: 0.6;
    padding: 0.25rem;
  }

  .icon-button:hover {
    opacity: 1;
  }

  .icon-button :global(svg) {
    fill: currentColor;
    height: 1.25rem;
    width: 1.25rem;
  }

  .form {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input {
    background: transparent;
    border: 1px solid var(--color-slate-80);
    border-radius: 0.5rem;
    color: inherit;
    font: inherit;
    font-size: 0.9375rem;
    padding: 0.5rem 0.75rem;
    width: 100%;
  }

  .input:focus {
    border-color: var(--color-lime-50);
    outline: none;
  }

  .add {
    background: var(--color-lime-50);
    border: 0;
    border-radius: 0.5rem;
    color: var(--color-slate-105);
    cursor: pointer;
    font: inherit;
    padding: 0.5rem 1rem;
  }
</style>
