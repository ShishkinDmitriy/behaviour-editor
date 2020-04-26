<script>
  import { stores, goto } from "@sapper/app";
  import api from "@/api/api";
  import Graph from "@/components/graph.svelte";

  const { page } = stores();
  let id = $page.params.id;
  let data = api[id];
</script>

<Graph data={data} on:node-dblclick={event => goto(`/${event.detail}`)} />
