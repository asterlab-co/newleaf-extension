<script lang="ts">
  import { DateTime, CustomLinkGroup, DrawerSettingsButton, Screen, ScreenContent } from '../../components';
  import { settings } from '../../state/settings.svelte';
  import { randomBackgroundUrl } from '../../utils/backgrounds';

  let { onNavigate }: { onNavigate: () => void } = $props()
  const background = randomBackgroundUrl();
</script>

<Screen {background}>
  <ScreenContent>
    <DateTime />
    <CustomLinkGroup />

    <DrawerSettingsButton onOpen={onNavigate} />
  </ScreenContent>
</Screen>
