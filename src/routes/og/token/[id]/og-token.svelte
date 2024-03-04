<script>
  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  import { formatDistanceToNow } from 'date-fns'

  /**
   * @type {import('$lib/types/poap').POAPToken}
   */
  export let token
  /**
   * @type {import('$lib/types/poap').POAPEventMetadata}
   */
  export let metadata
  /**
   * @type {import('$lib/types/ens').ENSRecords}
   */
  export let ens
  /**
   * @type {string}
   */
  export let avatar
  /**
   * @type {string}
   */
  export let background
  /**
   * @type {boolean}
   */
  export let isStatic = false
</script>

<div
  style:display="flex"
  style:position="relative"
  style:align-items="center"
  style:justify-content="center"
  style:width="100%"
  style:height="100%"
  style:font-family="sans-serif"
  style:font-weight="400"
>
  <div style:display="flex" style:position="absolute" style:width="100%" style:height="100%">
    <img src={background} alt="background" />
  </div>
  <div
    style:display="flex"
    style:width="1100px"
    style:height="256px"
    style:background-color="rgb(212, 212, 212)"
    style:border-width="1px"
    style:border-color="rgba(0, 0, 0, 0.3)"
    style:border-radius="12px"
    style:overflow="hidden"
    style:z-index="1"
  >
    <div
      style:display="flex"
      style:padding="16px"
      style:background-image="radial-gradient(circle at center, rgb(0, 0, 0), rgba(0, 0, 0, 0.4))"
    >
      <div
        style:display="flex"
        style:padding="11px"
        style:border-radius="8px"
        style:background-color="rgba(255, 255, 255, 0.8)"
        style:filter={'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))'}
      >
        <img
          style:width="200px"
          style:height="200px"
          style:border-radius="4px"
          style:overflow="hidden"
          style:object-fit="scale-down"
          src={avatar}
          alt="{ens.name || `${token.owner.id.slice(0, 6)}…${token.owner.id.slice(-4)}`} avatar"
        />
      </div>
    </div>
    <div
      style:flex="1 1 0%"
      style:display="flex"
      style:flex-direction="column"
      style:gap="4px"
      style:padding="16px"
      style:overflow-x="hidden"
    >
      <div style:display="flex">
        <h2
          style:margin="0"
          style:color="rgb(67, 56, 202)"
          style:font-size="20px"
          style:line-height="28px"
          style:font-weight="600"
          style:overflow="hidden"
          style:text-overflow="ellipsis"
          style:white-space="nowrap"
        >
          {#if isStatic}
            POAP live feed
          {:else}
            {metadata.name}
          {/if}
        </h2>
      </div>
      <div style:flex="1 1 0%" style:display="flex" style:overflow="hidden">
        <p style:margin="0" style:overflow="hidden" style:white-space="pre-wrap">
          {#if isStatic}
            Hit the refresh button to watch live POAPS!
          {:else}
            {metadata.description.replace(/\r?\n/g, ' ')}
          {/if}
        </p>
      </div>
      {#if !isStatic}
        <div
          style:display="flex"
          style:align-items="center"
          style:justify-content="space-between"
          style:color="rgb(67, 56, 202)"
          style:font-family="monospace"
        >
          <p style:margin="4px 0">
            Token
            <span style:margin-left="4px" style:font-family="monospace">
              #{token.id}
            </span>
          </p>
          <p style:margin="0">
            Mint
            <span style:margin-left="4px" style:font-family="monospace">
              #{token.mintOrder}
            </span>
          </p>
          <p style:margin="0">
            Event
            <span style:margin-left="4px" style:font-family="monospace">
              #{token.event.id}
            </span>
          </p>
        </div>
      {/if}
      <div style:display="flex" style:align-items="center" style:justify-content="space-between">
        <div
          style:display="flex"
          style:align-items="center"
          style:gap="8px"
          style:font-weight="600"
          style:font-family="monospace"
        >
          <p style:margin="0" style:color="rgb(67, 56, 202)" style:font-size="14px">
            {token.owner.id}
          </p>

          <span
            style:margin="0"
            style:background-color="rgb(64, 64, 64)"
            style:color="rgb(229, 229, 229)"
            style:padding="0 8px"
            style:border-radius="9999px"
            style:border-width="1px"
            style:border-color="rgba(115, 115, 115, 0.5)"
            style:font-size="12px"
            style:line-height="16px"
          >
            {#if isStatic}
              ∞
            {:else}
              {token.owner.tokensOwned}
            {/if}
          </span>
        </div>
        {#if !isStatic}
          <p style:margin="0" style:text-align="right" style:font-size="14px">
            {formatDistanceToNow(Number(token.created) * 1000, {
              includeSeconds: true,
              addSuffix: true,
            })}
          </p>
        {/if}
      </div>
    </div>
    <div
      style:display="flex"
      style:padding="16px"
      style:background-image="radial-gradient(circle at center, rgb(0, 0, 0), rgba(0, 0, 0, 0.4))"
    >
      <div
        style:display="flex"
        style:background-color="rgba(255, 255, 255, 0.8)"
        style:padding="4px"
        style:border-radius="9999px"
        style:filter={'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))'}
      >
        <img
          style:width="214px"
          style:height="214px"
          style:border-radius="9999px"
          style:object-fit="scale-down"
          src={isStatic ? 'https://poap.xyz/apple-touch-icon.png' : metadata.image_url}
          alt="{metadata.name} POAP image"
        />
      </div>
    </div>
  </div>
</div>
