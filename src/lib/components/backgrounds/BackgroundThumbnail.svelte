<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte'

  let {
    url,
    location,
    selected = false,
    onToggle,
  }: {
    url: string
    /** Place the scene evokes, used as the accessible name when we have one. */
    location?: string
    selected?: boolean
    onToggle: () => void
  } = $props()

  const name = $derived(location ?? 'this background')
</script>

<button
  class="thumb"
  class:thumb--selected={selected}
  type="button"
  aria-pressed={selected}
  aria-label={selected ? `Remove ${name} from rotation` : `Add ${name} to rotation`}
  title={location}
  onclick={onToggle}
>
  <!-- Full-size images double as thumbnails; lazy + async decoding keeps a
       grid of them from blocking the drawer when the panel opens. -->
  <img class="thumb__image" src={url} alt="" loading="lazy" decoding="async" />
  <span class="thumb__check" aria-hidden="true"><CheckIcon weight="bold" /></span>
</button>

<style>
  .thumb {
    aspect-ratio: 16 / 9;
    background: hsl(from var(--color-background-dark) h s l / 0.6);
    border: 1.5px solid var(--color-border-subtle);
    border-radius: 0.5rem;
    cursor: pointer;
    display: block;
    overflow: hidden;
    padding: 0;
    position: relative;
    transition: border-color 150ms ease;
    width: 100%;
  }

  .thumb:hover {
    border-color: var(--color-foreground-subtle);
  }

  .thumb:focus-visible {
    outline: 1.5px solid var(--color-accent-default);
    outline-offset: 2px;
  }

  .thumb--selected {
    border-color: var(--color-accent-default);
  }

  /* Unpicked images sit back a little so the chosen set reads at a glance. */
  .thumb__image {
    display: block;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    transition: opacity 150ms ease;
    width: 100%;
  }

  .thumb:hover .thumb__image,
  .thumb--selected .thumb__image {
    opacity: 1;
  }

  .thumb__check {
    align-items: center;
    background: var(--color-accent-default);
    border-radius: 50%;
    color: var(--color-foreground-contrast-default);
    display: flex;
    height: 1.25rem;
    inset-block-start: 0.375rem;
    inset-inline-end: 0.375rem;
    justify-content: center;
    opacity: 0;
    position: absolute;
    transition: opacity 150ms ease;
    width: 1.25rem;
  }

  .thumb--selected .thumb__check {
    opacity: 1;
  }

  .thumb__check :global(svg) {
    height: 0.75rem;
    width: 0.75rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .thumb,
    .thumb__image,
    .thumb__check {
      transition-duration: 0s;
    }
  }
</style>
