<script lang="ts">
  import { DateTime, CustomLinkGroup, DrawerSettingsButton, Screen, ScreenContent } from '@lib/components';
  import { settings } from '@lib/state/settings.svelte';
  import { randomBackgroundUrl } from '@lib/utils/backgrounds';

  let { onNavigate }: { onNavigate: () => void } = $props()
  const background = randomBackgroundUrl();
</script>

<Screen {background}>
  <ScreenContent>
    <DateTime {background} />
    <CustomLinkGroup />

    <DrawerSettingsButton onOpen={onNavigate} />
  </ScreenContent>
</Screen>
