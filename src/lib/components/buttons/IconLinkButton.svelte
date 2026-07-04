<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    href = '#',
    onclick,
    icon,
    label,
  }: {
    href?: string
    onclick?: (e: MouseEvent) => void
    icon: Snippet
    /** Accessible name for the link, since there is no visible text. */
    label: string
  } = $props()
</script>

<a class="icon-link-button" {href} {onclick} aria-label={label} title={label}>
  <span class="icon-link-button__icon">{@render icon()}</span>
</a>

<style>
  .icon-link-button {
    --size-icon-link-button: 3.5rem;
    align-items: center;
    backdrop-filter: blur(8px);
    background: hsl(from var(--color-background-default) h s l / 0.45);
    border: 1.5px solid var(--color-border-subtle);
    border-radius: 50%;
    color: var(--color-foreground-strong);
    display: inline-flex;
    height: var(--size-icon-link-button);
    justify-content: center;
    text-decoration: none;
    transition: background 150ms ease, border-color 150ms ease;
    width: var(--size-icon-link-button);
  }

  .icon-link-button:hover {
    background: hsl(from var(--color-background-dark) h s l / 0.5);
    border-color: var(--color-accent-default);
  }

  .icon-link-button__icon {
    --size-icon-link-button-icon: 1.75rem;
    display: inline-flex;
    height: var(--size-icon-link-button-icon);
    width: var(--size-icon-link-button-icon);
  }

  /* Make any SVG passed in fill the icon slot and inherit the foreground color. */
  .icon-link-button__icon :global(svg) {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }
</style>
