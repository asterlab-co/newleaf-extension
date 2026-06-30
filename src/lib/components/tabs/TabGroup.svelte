<script lang="ts">
  import Tab from './Tab.svelte'

  interface TabItem {
    id: string
    label: string
  }

  let {
    tabs,
    active = $bindable(),
  }: {
    tabs: TabItem[]
    /** Id of the selected tab. Bindable so the parent can render the panel. */
    active: string
  } = $props()

  let buttons = $state<HTMLButtonElement[]>([])

  // Roving tabindex + arrow-key navigation, per the WAI-ARIA tabs pattern:
  // only the active tab is in the tab order, and arrows move selection within
  // the list, focusing the newly selected tab.
  function select(index: number) {
    const next = (index + tabs.length) % tabs.length
    active = tabs[next].id
    buttons[next]?.focus()
  }

  function onKeydown(e: KeyboardEvent) {
    const i = tabs.findIndex((t) => t.id === active)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      select(i + 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      select(i - 1)
    }
  }
</script>

<div class="tabs" role="tablist">
  {#each tabs as tab, i (tab.id)}
    <Tab
      id={tab.id}
      label={tab.label}
      selected={active === tab.id}
      bind:ref={buttons[i]}
      onActivate={() => (active = tab.id)}
      onkeydown={onKeydown}
    />
  {/each}
</div>

<style>
  .tabs {
    border-bottom: 1px solid var(--color-slate-80);
    display: flex;
    gap: 1rem;
  }
</style>
