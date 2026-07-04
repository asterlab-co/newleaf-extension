<script lang="ts">
  import { settings } from '@lib/state/settings.svelte';
  import { sortLinks } from '@lib/utils/links';
  import CustomLink from './CustomLink.svelte';

  let orderedLinks = $derived(sortLinks(settings.quickLinks, settings.linkSort));
</script>

{#if settings.showLinks && settings.quickLinks.length > 0}
  <nav class="custom-link-group" aria-label="Quick links">
    {#each orderedLinks as link (link.id)}
      <CustomLink {link} />
    {/each}
  </nav>
{/if}

<style>
  .custom-link-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: .25rem 0;
  }
</style>
