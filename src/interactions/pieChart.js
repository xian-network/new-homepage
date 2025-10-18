import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';
import { GRAPHQL_ENDPOINT } from './constants.js';

Chart.register(ArcElement, Tooltip, Legend, Title, PieController);

async function fetchXianStats() {
  const container = document.getElementById('xianPieChart');
  if (!container) return;

  const graphUrl = GRAPHQL_ENDPOINT;
  const CHUNK_SIZE = 2000;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('.')[0];

  const nowQuery = `query {
    allEvents(condition: { contract: "con_pairs", event: "Swap" },
              filter: { dataIndexed: { contains: { pair: "1" } } },
              orderBy: CREATED_DESC, first: 1) {
      edges { node { data } }
    }
  }`;

  const volumeQuery = `query {
    allEvents(condition: { contract: "con_pairs", event: "Swap" },
              filter: { dataIndexed: { contains: { pair: "1" } },
                        created: { greaterThan: "${since}" } },
              first: 1000) {
      edges { node { data } }
    }
  }`;

  const countQuery = `query {
    allStates(
      filter: {
        and: {
          key: { startsWith: "currency.balances:", notLike: "%:%:%" },
          valueNumeric: { greaterThan: "0" }
        }
      }
    ) {
      totalCount
    }
  }`;

  const excludedQuery = `query {
    allStates(filter: {
      key: { in: [
        "currency.balances:team_lock",
        "currency.balances:dao_funding_stream",
        "currency.balances:dao",
        "currency.balances:con_team_y1_linear_vesting"
      ] }
    }) {
      edges { node { key, value } }
    }
  }`;

  try {
    const [resNow, resVol, resCount, resExcluded] = await Promise.all([
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: nowQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: volumeQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: countQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: excludedQuery }) }).then((r) => r.json()),
    ]);

    const totalCount = resCount?.data?.allStates?.totalCount ?? 0;
    let totalSupply = 0;

    for (let offset = 0; offset < totalCount; offset += CHUNK_SIZE) {
      const chunkQuery = `query ($first: Int!, $offset: Int!) {
        allStates(
          filter: {
            and: {
              key: { startsWith: "currency.balances:", notLike: "%:%:%" },
              valueNumeric: { greaterThan: "0" }
            }
          },
          orderBy: VALUE_DESC,
          first: $first,
          offset: $offset
        ) {
          edges {
            node {
              value
            }
          }
        }
      }`;

      const chunkResp = await fetch(graphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: chunkQuery, variables: { first: CHUNK_SIZE, offset } }),
      }).then((r) => r.json());

      const chunkValues = chunkResp?.data?.allStates?.edges?.map((edge) => parseFloat(edge?.node?.value ?? '0')) ?? [];
      totalSupply += chunkValues.reduce((sum, value) => sum + value, 0);
    }

    const excludedMap = Object.fromEntries(
      (resExcluded?.data?.allStates?.edges ?? []).map((edge) => [edge?.node?.key, parseFloat(edge?.node?.value ?? '0')])
    );

    const treasury = excludedMap['currency.balances:dao'] || 0;
    const vesting = excludedMap['currency.balances:con_team_y1_linear_vesting'] || 0;
    const locker = excludedMap['currency.balances:team_lock'] || 0;
    const stream = excludedMap['currency.balances:dao_funding_stream'] || 0;

    const circulating = totalSupply - (treasury + vesting + locker + stream);

    const ctx = container.getContext('2d');
    if (!ctx) return;

    if (window.xianPieChart && typeof window.xianPieChart.destroy === 'function') {
      window.xianPieChart.destroy();
    }

    const isMobile = window.innerWidth <= 600;
    window.xianPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Validator DAO Treasury', 'Validator DAO Vesting', 'Team Locker', 'Team Vesting', 'Circulating'],
        datasets: [
          {
            data: [treasury, stream, locker, vesting, circulating],
            backgroundColor: ['#06e6cb', '#f39c12', '#9b59b6', '#45b7d1', '#96ceb4'],
            borderColor: ['#04b8a3', '#d68910', '#7d3c98', '#3a9bc1', '#7fb89a'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: isMobile ? 'bottom' : 'right',
            labels: {
              color: '#ffffff',
              font: { size: 14 },
            },
          },
          title: {
            display: true,
            text: 'Live $XIAN Token Distribution',
            color: '#ffffff',
            font: { size: 20, weight: 'bold' },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to load XIAN stats', error);
  }
}

export function initPieChart(cleanups) {
  fetchXianStats();
  const intervalId = window.setInterval(fetchXianStats, 60_000);
  cleanups.push(() => {
    window.clearInterval(intervalId);
    if (window.xianPieChart && typeof window.xianPieChart.destroy === 'function') {
      window.xianPieChart.destroy();
      window.xianPieChart = undefined;
    }
  });
}
