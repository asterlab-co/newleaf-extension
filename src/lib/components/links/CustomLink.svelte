<script lang="ts">
  import { ArrowUpRightIcon } from 'phosphor-svelte';
  import { hostname, type QuickLink } from '../../utils/links';

  let { link }: { link: QuickLink } = $props();

  // First letter shown in the circle: from the label when set, else the hostname.
  let initial = $derived((link.label.trim() || hostname(link.url)).charAt(0).toUpperCase());

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
  <span class="custom-link__initial" aria-hidden="true">{initial}</span>
  {link.label}
  <i class="icon">
    <ArrowUpRightIcon weight="bold" />
  </i>
</a>

<style>
  .custom-link {
    align-items: center;
    backdrop-filter: blur(8px);
    background: hsl(from var(--color-slate-100) h s l / 0.4);
    border: 1px solid hsl(from var(--color-slate-10) h s l / 0.15);
    border-radius: 999px;
    color: inherit;
    display: inline-flex;
    font-size: 1rem;
    gap: 0.4375rem;
    padding: 0.5rem .75rem .625rem;
    transition: background 150ms ease, border-color 150ms ease;
  }

  .custom-link:hover {
    background: hsl(from var(--color-slate-100) h s l / 0.6);
    border-color: var(--color-lime-50);
  }

  .custom-link__initial {
    --size-custom-link-initial: 1.375rem;
    align-items: center;
    background: hsl(from var(--color-slate-10) h s l / 0.8);
    border-radius: 50%;
    color: var(--color-slate-100);
    display: inline-flex;
    flex-shrink: 0;
    font-size: 0.875rem;
    font-weight: 600;
    height: var(--size-custom-link-initial);
    justify-content: center;
    line-height: 1;
    margin: 0 .125rem -.125rem 0;
    width: var(--size-custom-link-initial);
  }

  .custom-link .icon {
    display: inline-flex;
    flex-shrink: 0;
    font-size: 1rem;
    padding: .0625rem 0 0;
  }
</style>
