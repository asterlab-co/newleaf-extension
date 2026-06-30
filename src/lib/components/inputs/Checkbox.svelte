<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    checked = $bindable(),
    children,
  }: {
    checked: boolean
    children: Snippet
  } = $props()
</script>

<label class="check">
  <input type="checkbox" bind:checked />
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
    accent-color: var(--color-lemon-50);
    cursor: pointer;
  }
</style>
