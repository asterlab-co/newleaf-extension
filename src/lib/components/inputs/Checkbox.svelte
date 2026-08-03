<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    checked = $bindable(),
    onChange,
    children,
  }: {
    checked: boolean
    /** For callers whose checked state is derived and can't be bound directly. */
    onChange?: (checked: boolean) => void
    children: Snippet
  } = $props()
</script>

<label class="check">
  <input type="checkbox" bind:checked onchange={() => onChange?.(checked)} />
  {@render children()}
</label>

<style>
  .check {
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
  }

  .check input {
    accent-color: var(--color-accent-default);
    cursor: pointer;
  }
</style>
