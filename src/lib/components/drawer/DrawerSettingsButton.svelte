<script lang="ts">
  import { FadersHorizontalIcon } from 'phosphor-svelte'
  import IconLinkButton from '../buttons/IconLinkButton.svelte'

  let { onOpen }: { onOpen: () => void } = $props()
</script>

<div class="corner-action">
  <IconLinkButton
    href="#settings"
    label="Settings"
    onclick={(e) => { e.preventDefault(); onOpen() }}
  >
    {#snippet icon()}
      <FadersHorizontalIcon />
    {/snippet}
  </IconLinkButton>
</div>

<style>
  .corner-action {
    position: absolute;
    right: clamp(1rem, 3.33vw, 2rem);
    top: clamp(1rem, 3.33vw, 2rem);
  }
</style>
