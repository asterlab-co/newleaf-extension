<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    onclick,
    icon,
    label,
  }: {
    onclick?: (e: MouseEvent) => void
    icon: Snippet
    /** Accessible name for the button, since there is no visible text. */
    label: string
  } = $props()
</script>

<button class="icon-button" type="button" {onclick} aria-label={label} title={label}>
  <span class="icon-button__icon">{@render icon()}</span>
</button>

<style>
  /* Quiet, text-sized icon button for sitting inline next to a label. Sized in
     em so it scales with whatever type it's placed beside. */
  .icon-button {
    --size-icon-button: 1.5em;
    align-items: center;
    background: none;
    border: none;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    flex: none;
    height: var(--size-icon-button);
    justify-content: center;
    opacity: 0.75;
    padding: 0;
    transition: background 150ms ease, color 150ms ease, opacity 150ms ease;
    width: var(--size-icon-button);
  }

  .icon-button:hover {
    background: hsl(from var(--color-background-default) h s l / 0.35);
    color: var(--color-foreground-strong);
    opacity: 1;
  }

  .icon-button:focus-visible {
    opacity: 1;
    outline: 1.5px solid var(--color-accent-default);
    outline-offset: 2px;
  }

  .icon-button__icon {
    --size-icon-button-icon: 1em;
    display: inline-flex;
    height: var(--size-icon-button-icon);
    width: var(--size-icon-button-icon);
  }

  /* Make any SVG passed in fill the icon slot and inherit the foreground color. */
  .icon-button__icon :global(svg) {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }
</style>
