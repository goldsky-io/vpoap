<script lang="ts">
  import type { ENSRecords } from '$lib/types/ens'
  import type { POAPAccount } from '$lib/types/poap'

  export let account: POAPAccount
  export let ens: ENSRecords = {}

  $: address = ens.name || account.id.slice(0, 6) + '…' + account.id.slice(-4)
</script>

<div class="flex items-center gap-2 text-base font-semibold truncate">
  <a
    class="text-indigo-700 hover:brightness-110 hover:underline transition-all"
    class:font-mono={!ens.name}
    href="/account/{ens.name || account.id}"
  >
    {address}
  </a>
  <span
    class="bg-neutral-700 text-neutral-200 rounded-full border border-neutral-500/50 px-2 text-xs font-mono"
    >{account.tokensOwned}</span
  >
</div>
