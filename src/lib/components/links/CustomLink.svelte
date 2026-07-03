<script lang="ts">
  import { ArrowUpRightIcon } from 'phosphor-svelte';
  import { displayName, type QuickLink } from '../../utils/links';
  import LinkInitial from './LinkInitial.svelte';

  let { link }: { link: QuickLink } = $props();

  // Chrome blocks navigating to privileged schemes (chrome://, chrome-extension://,
  // about:, etc.) from a normal anchor click, so those links silently do nothing.
  // Open them through the extension tabs API instead.
  const PRIVILEGED_SCHEME = /^(?!https?:)[a-z][a-z0-9+.-]*:/i;

  function handleClick(event: MouseEvent) {
    if (!PRIVILEGED_SCHEME.test(link.url)) return;
    // A plain anchor to a privileged scheme is blocked by the browser either
    // way, so always cancel it; we can only open these via the extension API.
    event.preventDefault();
    const tabs = (globalThis as any).chrome?.tabs;
    if (!tabs?.create) {
      console.warn(
        `[newleaf] Cannot open "${link.url}": chrome.tabs is unavailable. ` +
          `Open this page as the installed extension's new tab, not the dev server.`,
      );
      return;
    }
    tabs.create({ url: link.url });
  }
</script>

<a
  class="custom-link"
  href={link.url}
  target="_blank"
  rel="noopener noreferrer"
  onclick={handleClick}
>
  <span class="custom-link__initial">
    <LinkInitial {link} />
  </span>
  {displayName(link)}
  <i class="icon">
    <ArrowUpRightIcon weight="bold" />
  </i>
</a>

<style>
  .custom-link {
    align-items: center;
    backdrop-filter: blur(8px);
    background: hsl(from var(--color-background-default) h s l / 0.45);
    border: 1.5px solid hsl(from var(--color-border-default) h s l / .3);
    border-radius: 999px;
    color: inherit;
    display: inline-flex;
    font-size: 1rem;
    gap: 0.4375rem;
    padding: 0.5rem .75rem .625rem;
    transition: background 150ms ease, border-color 150ms ease;
  }

  .custom-link:hover {
    background: hsl(from var(--color-background-dark) h s l / 0.5);
    border-color: var(--color-accent-default);
  }

  .custom-link__initial {
    display: inline-flex;
    margin: 0 .125rem -.125rem 0;
  }

  .custom-link .icon {
    display: inline-flex;
    flex-shrink: 0;
    font-size: 1rem;
    padding: .0625rem 0 0;
  }
</style>
