<script lang="ts">
  import { displayName, isLightColor, type QuickLink } from '@lib/utils/links';

  let { link }: { link: QuickLink } = $props();

  // First letter shown in the circle: from the label when set, else the hostname.
  let initial = $derived(displayName(link).charAt(0).toUpperCase());
  let textColor = $derived(
    isLightColor(link.color)
      ? 'var(--color-foreground-contrast-default)'
      : 'var(--color-foreground-default)',
  );
</script>

<span class="link-initial" style:background={link.color} style:color={textColor} aria-hidden="true">
  {initial}
</span>

<style>
  .link-initial {
    --size-link-initial: 1.625rem;
    align-items: center;
    border-radius: 50%;
    display: inline-flex;
    flex-shrink: 0;
    font-size: 0.875rem;
    font-weight: 600;
    height: var(--size-link-initial);
    justify-content: center;
    line-height: 1;
    width: var(--size-link-initial);
  }
</style>
