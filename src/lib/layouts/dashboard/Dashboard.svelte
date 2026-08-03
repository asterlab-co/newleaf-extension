<script lang="ts">
  import { untrack } from 'svelte';
  import { BackgroundNote, DateTime, CustomLinkGroup, DrawerSettingsButton, Screen, ScreenContent } from '@lib/components';
  import { settings } from '@lib/state/settings.svelte';
  import { backgroundPool, isInPool, randomBackground } from '@lib/utils/backgrounds';

  let { onNavigate }: { onNavigate: () => void } = $props()

  // The images in rotation: everything while "use all" is on, otherwise the
  // user's picks. An empty pick list falls back to everything too, so turning
  // the last image off can never leave the dashboard bare.
  const rotationIds = $derived(settings.useAllBackgrounds ? [] : settings.backgroundIds)

  // One random image per page load, drawn from that set and swappable from the
  // background note's refresh button. Passing the current one back guarantees a
  // different pick.
  // untrack: this is the one-off opening pick; the effect below keeps it in
  // step with later changes to the rotation.
  let background = $state(randomBackground(undefined, untrack(() => rotationIds)));

  // Editing the rotation in settings should show up right away, so drop the
  // current image as soon as it falls outside the chosen set.
  $effect(() => {
    const ids = rotationIds
    if (!isInPool(untrack(() => background), ids)) {
      background = randomBackground(undefined, ids)
    }
  })

  // With a single image in rotation there is nothing to refresh to.
  const canRefresh = $derived(backgroundPool(rotationIds).length > 1)
</script>

<Screen background={background?.url}>
  <ScreenContent>
    <DateTime />
    <CustomLinkGroup />

    <DrawerSettingsButton onOpen={onNavigate} />
  </ScreenContent>

  <!-- Outside ScreenContent: it reverses child order below 40rem, and the note
       should stay pinned to the bottom-right corner at every width. -->
  <BackgroundNote
    location={background?.location}
    onRefresh={canRefresh
      ? () => (background = randomBackground(background, rotationIds))
      : undefined}
  />
</Screen>
