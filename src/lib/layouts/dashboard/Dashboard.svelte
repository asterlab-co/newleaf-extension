<script lang="ts">
  import { Clock, CustomLinkGroup, DrawerSettingsButton, Screen, ScreenContent, SearchBar } from '../../components';
  import { settings } from '../../state/settings.svelte';
  import { randomBackgroundUrl } from '../../utils/backgrounds';

  let { onNavigate }: { onNavigate: () => void } = $props()
  const background = randomBackgroundUrl();
</script>

<Screen {background}>
  <ScreenContent>
    <Clock />
    {#if settings.showSearch}
      <SearchBar />
    {/if}
    <CustomLinkGroup />

    <DrawerSettingsButton onOpen={onNavigate} />
  </ScreenContent>
</Screen>
