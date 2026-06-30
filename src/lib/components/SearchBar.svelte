<script lang="ts">
  import { MagnifyingGlassIcon } from 'phosphor-svelte'
</script>

<!-- A plain GET form to Google: the browser submits "?q=..." with no JS needed. -->
<form class="search" action="https://www.google.com/search" method="get" role="search" target="_blank">
  <span class="search__icon"><MagnifyingGlassIcon /></span>
  <input
    class="search__input"
    type="search"
    name="q"
    placeholder="Search Google"
    aria-label="Search Google"
    autocomplete="off"
    autocapitalize="off"
    spellcheck="false"
  />
</form>

<style>
  .search {
    align-items: center;
    backdrop-filter: blur(8px);
    background: hsl(from var(--color-slate-105) h s l / 0.5);
    border: 1px solid hsl(from var(--color-slate-10) h s l / 0.15);
    border-radius: 1.75rem;
    display: flex;
    gap: .625rem;
    height: 3.5rem;
    padding: 0.625rem 1rem;
    transition: border-color 150ms ease;
    width: min(100%, 60rem);
    /* width: 100%; */
  }

  .search:focus-within {
    border-color: var(--color-lime-50);
  }

  .search__icon {
    color: var(--color-foreground-strong);
    display: inline-flex;
    flex-shrink: 0;
    height: 1.5rem;
    width: 1.5rem;
  }

  .search__icon :global(svg) {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }

  .search__input {
    background: transparent;
    border: 0;
    color: var(--color-foreground-strong);
    flex: 1;
    font: inherit;
    font-size: 1rem;
    min-width: 0;
    outline: none;
  }

  .search__input::placeholder {
    color: var(--color-foreground-subtle);
    opacity: 0.8;
  }

  /* Hide the native clear/search decorations for a clean pill. */
  .search__input::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
