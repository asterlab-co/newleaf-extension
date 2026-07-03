<script lang="ts">
  let {
    id,
    label,
    selected = false,
    ref = $bindable(),
    onActivate,
    onkeydown,
  }: {
    id: string
    label: string
    selected?: boolean
    /** Bound by the group so it can move focus for roving tabindex. */
    ref?: HTMLButtonElement
    onActivate: () => void
    onkeydown: (e: KeyboardEvent) => void
  } = $props()
</script>

<button
  bind:this={ref}
  type="button"
  role="tab"
  id={`tab-${id}`}
  class="tab"
  class:tab--active={selected}
  aria-controls={`panel-${id}`}
  aria-selected={selected}
  tabindex={selected ? 0 : -1}
  onclick={onActivate}
  {onkeydown}
>
  {label}
</button>

<style>
  .tab {
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-size: 1rem;
    margin-bottom: -1px;
    opacity: 0.6;
    padding: 0.5rem 0.375rem;
  }

  .tab:hover {
    opacity: 1;
  }

  .tab--active {
    border-bottom-color: var(--color-accent-default);
    color: var(--color-accent-default);
    opacity: 1;
  }
</style>
