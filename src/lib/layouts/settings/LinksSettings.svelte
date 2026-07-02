<script lang="ts">
  import { tick } from 'svelte'
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon'
  import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon'
  import DotsSixVerticalIcon from 'phosphor-svelte/lib/DotsSixVerticalIcon'
  import CheckIcon from 'phosphor-svelte/lib/CheckIcon'
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon'
  import XIcon from 'phosphor-svelte/lib/XIcon'
  import { settings } from '../../state/settings.svelte'
  import {
    normalizeUrl,
    isValidUrl,
    displayName,
    hostname,
    sortLinks,
    randomLinkColor,
    LINK_SORTS,
    type QuickLink,
  } from '../../utils/links'
  import { Checkbox, ColorPicker, LinkInitial, TextField } from '../../components'

  // The add form expands in place of the "Your links" heading while open.
  let adding = $state(false)
  let label = $state('')
  let url = $state('')
  let color = $state(randomLinkColor())
  let urlError = $state('')
  let addUrlInput = $state<HTMLInputElement>()
  let addButton = $state<HTMLButtonElement>()

  // Inline editing of an existing link.
  let editingId = $state<string | null>(null)
  let editLabel = $state('')
  let editUrl = $state('')
  let editColor = $state('#ffffff')
  let editUrlError = $state('')

  const URL_ERROR = 'That doesn’t look like a valid URL — try something like example.com.'

  // A failed submit flags the URL field; editing the value clears the flag.
  $effect(() => {
    url
    urlError = ''
  })
  $effect(() => {
    editUrl
    editUrlError = ''
  })

  // Drag-and-drop reordering, by id of the link being dragged.
  let dragId = $state<string | null>(null)

  // Links shown here in the same order the dashboard uses.
  let orderedLinks = $derived(sortLinks(settings.quickLinks, settings.linkSort))
  // Manual reordering only applies to the custom (manual) order.
  let canReorder = $derived(settings.linkSort === 'custom')

  // Focus moves between the "+" button and the form, but the target is inert
  // until the DOM reflects the toggle — hence the tick() before focusing.
  async function openAdd() {
    adding = true
    await tick()
    addUrlInput?.focus()
  }

  async function closeAdd() {
    adding = false
    await tick()
    addButton?.focus()
  }

  function onAddKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // Keep the Escape from also closing the settings drawer.
      e.stopPropagation()
      closeAdd()
    }
  }

  function add(e: SubmitEvent) {
    e.preventDefault()
    const href = normalizeUrl(url)
    if (!href) return
    if (!isValidUrl(href)) {
      urlError = URL_ERROR
      return
    }
    settings.quickLinks.push({
      id: crypto.randomUUID(),
      // Stored as entered — an omitted label stays empty and the views fall
      // back to the hostname via displayName().
      label: label.trim(),
      url: href,
      color,
      addedAt: Date.now(),
    })
    label = ''
    url = ''
    color = randomLinkColor()
    closeAdd()
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
    editColor = link.color
  }

  function saveEdit(e: SubmitEvent) {
    e.preventDefault()
    const link = settings.quickLinks.find((l) => l.id === editingId)
    if (link) {
      const href = normalizeUrl(editUrl)
      if (!href) return
      if (!isValidUrl(href)) {
        editUrlError = URL_ERROR
        return
      }
      link.url = href
      link.label = editLabel.trim()
      link.color = editColor
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
    <!-- The heading row and the add form share one grid cell: the form
         cross-fades in over the heading while the cell animates to the form's
         height (the 0fr → 1fr grid-row trick). Both stay mounted; `inert`
         hides the inactive one from pointer and tab order. -->
    <div class="links-header">
      <div class="links-header__row" inert={adding}>
        <h2 class="section-title">Your links</h2>
        <div class="links-header__controls">
          {#if settings.quickLinks.length > 1}
            <select
              class="sort__select"
              bind:value={settings.linkSort}
              aria-label="Sort links"
              title="Sort links"
            >
              {#each LINK_SORTS as opt (opt.id)}
                <option value={opt.id}>{opt.label}</option>
              {/each}
            </select>
          {/if}
          <button
            bind:this={addButton}
            type="button"
            class="accent-button"
            onclick={openAdd}
            aria-expanded={adding}
            aria-controls="add-link-form"
            aria-label="Add a link"
            title="Add a link"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <div class="add-wrap" class:add-wrap--open={adding}>
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -- the
             keydown is only an Escape-to-close shortcut; every control inside
             remains fully keyboard-operable without it. -->
        <form
          id="add-link-form"
          class="add-form"
          inert={!adding}
          onsubmit={add}
          onkeydown={onAddKeydown}
        >
          <div class="link-form__fields">
            <div class="link-form__field link-form__field--url">
              <TextField
                label="Link URL"
                placeholder="example.com"
                inputmode="url"
                required
                error={urlError}
                bind:value={url}
                bind:ref={addUrlInput}
              />
            </div>
            <div class="link-form__field">
              <TextField label="Label (optional)" bind:value={label} />
            </div>
            <div class="link-form__actions">
              <button
                type="button"
                class="icon-button"
                onclick={closeAdd}
                aria-label="Cancel"
                title="Cancel"
              >
                <XIcon />
              </button>
              <button type="submit" class="accent-button" aria-label="Add link" title="Add">
                <CheckIcon />
              </button>
            </div>
          </div>
          <ColorPicker bind:value={color} />
        </form>
      </div>
    </div>

    {#if settings.quickLinks.length > 0}
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
                <div class="link-form__fields">
                  <div class="link-form__field link-form__field--url">
                    <TextField
                      label="Link URL"
                      placeholder="example.com"
                      inputmode="url"
                      required
                      error={editUrlError}
                      bind:value={editUrl}
                    />
                  </div>
                  <div class="link-form__field">
                    <TextField label="Label (optional)" bind:value={editLabel} />
                  </div>
                  <div class="link-form__actions">
                    <button
                      type="button"
                      class="icon-button"
                      onclick={cancelEdit}
                      aria-label="Cancel"
                      title="Cancel"
                    >
                      <XIcon />
                    </button>
                    <button type="submit" class="accent-button" aria-label="Save" title="Save">
                      <CheckIcon />
                    </button>
                  </div>
                </div>
                <ColorPicker bind:value={editColor} />
              </form>
            {:else}
              {#if canReorder}
                <span class="link__handle" aria-hidden="true" title="Drag to reorder">
                  <DotsSixVerticalIcon />
                </span>
              {/if}
              <LinkInitial {link} />
              <span class="link__text">
                {#if link.label}
                  <span class="link__label">{link.label}</span>
                  <span class="link__url">{hostname(link.url)}</span>
                {:else}
                  <span class="link__label">{hostname(link.url)}</span>
                {/if}
              </span>
              <button
                type="button"
                class="icon-button"
                onclick={() => startEdit(link)}
                aria-label={`Edit ${displayName(link)}`}
                title="Edit"
              >
                <PencilSimpleIcon />
              </button>
              <button
                type="button"
                class="icon-button"
                onclick={() => remove(link.id)}
                aria-label={`Remove ${displayName(link)}`}
                title="Remove"
              >
                <TrashIcon />
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">No links yet. Use the + button above to add one to your dashboard.</p>
    {/if}
  </section>
</div>


<style>
  .links-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }

  .links-visibility,
  .links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .links-header {
    display: grid;
  }

  .links-header__row,
  .add-wrap {
    grid-area: 1 / 1;
  }

  .links-header__row {
    align-items: center;
    align-self: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    transition: opacity 150ms ease;
  }

  .links-header__row[inert] {
    opacity: 0;
  }

  .links-header__controls {
    align-items: center;
    display: flex;
    gap: 0.75rem;
  }

  /* Collapsed to zero height while closed; 0fr → 1fr animates the cell open
     to the form's natural height. The wrapper still stretches over the header
     row it shares the grid cell with, so it must not catch clicks while
     closed — only the form inside is inert, not the wrapper. */
  .add-wrap {
    display: grid;
    grid-template-rows: 0fr;
    pointer-events: none;
    transition: grid-template-rows 200ms ease;
  }

  .add-wrap--open {
    grid-template-rows: 1fr;
    pointer-events: auto;
  }

  .add-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 0;
    overflow: hidden;
    padding-bottom: 0.25rem;
    transition: opacity 150ms ease;
  }

  .add-form[inert] {
    opacity: 0;
  }

  .link-form__fields {
    align-items: flex-end;
    display: flex;
    gap: 0.75rem;
  }

  /* The URL is the primary field, so it gets twice the label's width. */
  .link-form__field {
    flex: 1;
    min-width: 0;
  }

  .link-form__field--url {
    flex: 2;
  }

  /* Right-edge rail: cancel in the form's top corner, submit on the input line.
     The gap keeps the two buttons apart by growing the row past the fields'
     natural height. */
  .link-form__actions {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 0.625rem;
    justify-content: space-between;
  }

  /* Round accent action: the header's "+" and the forms' submit checkmarks. */
  .accent-button {
    align-items: center;
    background: var(--color-accent-default);
    border: 0;
    border-radius: 50%;
    color: var(--color-foreground-contrast-default);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    height: 2.25rem;
    justify-content: center;
    width: 2.25rem;
  }

  .accent-button:hover {
    filter: brightness(1.08);
  }

  .accent-button :global(svg) {
    fill: currentColor;
    height: 1.25rem;
    width: 1.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .links-header__row,
    .add-wrap,
    .add-form {
      transition-duration: 0s;
    }
  }

  .section-title {
    color: var(--color-foreground-subtle);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  /* appearance: none drops the native arrow (whose gutter ignores padding),
     replaced by an inline SVG chevron so the right padding is real. */
  .sort__select {
    appearance: none;
    background: transparent
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%23B0BABE' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E")
      no-repeat right 0.625rem center / 0.75rem;
    border: 1px solid var(--color-slate-80);
    border-radius: 0.375rem;
    color: inherit;
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 2rem 0.375rem 0.625rem;
  }

  .sort__select:focus {
    border-color: var(--color-accent-default);
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
    gap: 1rem;
    padding: 0.375rem 0;
    width: 100%;
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
</style>
