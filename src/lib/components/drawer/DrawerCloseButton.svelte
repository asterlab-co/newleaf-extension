<script lang="ts">
  import XIcon from 'phosphor-svelte/lib/XIcon'
  import IconLinkButton from '../buttons/IconLinkButton.svelte'

  let { onClose }: { onClose: () => void } = $props()
</script>

<div class="corner-action">
  <IconLinkButton
    href="#back"
    label="Close"
    onclick={(e) => { e.preventDefault(); onClose() }}
  >
    {#snippet icon()}
      <XIcon />
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
