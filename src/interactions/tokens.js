import { GRAPHQL_ENDPOINT } from './constants.js';

export async function loadTokens() {
  const tokenGrid = document.getElementById('token-grid');
  if (!tokenGrid) return;

  const contractsQuery = `
    query TokenContracts($first: Int!) {
      allContracts(
        first: $first,
        orderBy: CREATED_DESC,
        filter: { xsc0001: { equalTo: true } }
      ) {
        nodes {
          name
          created
        }
      }
    }
  `;

  const itemsPerPage = 3;

  try {
    const contractsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: contractsQuery,
        variables: { first: itemsPerPage },
      }),
    });

    const contractsJson = await contractsResponse.json();
    const contracts = contractsJson?.data?.allContracts?.nodes ?? [];
    if (!contracts.length) return;

    const metaKeys = contracts.flatMap(({ name }) => [
      `${name}.metadata:token_name`,
      `${name}.metadata:token_symbol`,
    ]);

    const metadataQuery = `
      query TokenMeta($keys: [String!]!) {
        allStates(filter: { key: { in: $keys } }) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    `;

    const metadataResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: metadataQuery, variables: { keys: metaKeys } }),
    });

    const metadataJson = await metadataResponse.json();
    const metadataEdges = metadataJson?.data?.allStates?.edges ?? [];
    const metadataMap = {};

    metadataEdges.forEach(({ node }) => {
      if (!node) return;
      const [contractKey, field] = node.key.split(':');
      const contractName = contractKey.replace('.metadata', '');
      metadataMap[contractName] = metadataMap[contractName] || {};
      metadataMap[contractName][field] = node.value;
    });

    tokenGrid.innerHTML = '';

    contracts.forEach(({ name, created }) => {
      const metadata = metadataMap[name] || {};
      const tokenName = metadata.token_name || name;
      const tokenSymbol = metadata.token_symbol ? ` (${metadata.token_symbol})` : '';
      const displayName = `${tokenName}${tokenSymbol}`;
      const createdDate = new Date(created).toLocaleString();

      const card = document.createElement('div');
      card.className = 'showcase-card';
      card.innerHTML = `
        <h3 class="showcase-card__title">${displayName}</h3>
        <p class="showcase-card__desc">Created ${createdDate}</p>
        <a href="https://explorer.xian.org/tokens/${name}" target="_blank" class="showcase-card__link" style="color: #06e6cb;">
          <span class="lang-en">View</span>
        </a>
      `;
      tokenGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching token data:', error);
  }
}
