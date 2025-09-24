 if (window.location.protocol === "http:") {
   window.location.href = window.location.href.replace("http:", "https:");
 }
$(document).ready(function() {
  

// Burgerr menu
if ($(window).width() <= 992) {
    $(".btn_nav").click(function () {
      $(".burger").toggleClass("active");
      if ($(".header-wrapper").is(":hidden")) {
        $("body").addClass("hidden");
        $(".bg-blur").addClass("blur");
        $(".header").addClass("blur");

        setTimeout(function () {
          $(".header-wrapper").slideDown(200).css({ display: "flex" });
        }, 100);
      } else {
        $(".header-wrapper").slideUp(200);
        setTimeout(function () {}, 300);
        $("body").removeClass("hidden");
        $(".bg-blur").removeClass("blur");
        $(".header").removeClass("blur");
      }
    });

    $(".header-wrapper li:not(.menu-item-has-children) a, .header-wrapper .main-button, .header-icons a").click(function () {
      $(".header-wrapper").slideUp(200);
      $(".burger").removeClass("active");
      $("body").removeClass("hidden");
      $(".bg-blur").removeClass("blur");
      $(".header").removeClass("blur");
    });

    $(window).resize(function () {
      if ($(window).width() > 992) {
        $(".header-wrapper").removeAttr("style");
        $(".burger").removeClass("active");
        $("body").removeClass("hidden");
        $(".bg-blur, .header").removeClass("blur");
      }
    });

}

// typewriter 
  $('.typewriter-text').each(function() {
    const $this = $(this);
    const texts = $this.data('text');
    typing(0, texts, $this);
  });

  function typing(index, texts, $element) {
    let textIndex = 1;

    const tmp = setInterval(function() {
      if (textIndex <= texts[index].length) {
        $element.text(texts[index].substr(0, textIndex));
        textIndex++;
      } else {
        setTimeout(function() { deleting(index, texts, $element); }, 2000);
        clearInterval(tmp);
      }
    }, 150);
  }

  function deleting(index, texts, $element) {
    let textIndex = texts[index].length;

    const tmp = setInterval(function() {
      if (textIndex > 0) {
        $element.text(texts[index].substr(0, textIndex));
        textIndex--;
      } else {
        index = (index + 1) % texts.length;
        typing(index, texts, $element);
        clearInterval(tmp);
      }
    }, 150);
  }

});

  // Helper function to extract the thumbnail URL from the description
  function extractThumbnail(description) {
    const match = description.match(/<img[^>]*src="([^"]*)"/);
    return match ? match[1] : "./assets/img/news-img.png"; // Default image if no thumbnail
  }

  // Helper function to truncate text
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  // Helper function to remove figures from the description
  function removeFigures(description) {
    return description.replace(/<figure>.*<\/figure>/, "");
  }


// drag and drop
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.roadmap-item__tasks'); // All containers with tasks

  const createPlaceholder = () => {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    return placeholder;
  };

  const enableDragAndDrop = (container) => {
    const tasks = container.querySelectorAll('.roadmap-item__task');
    let draggedItem = null;
    let placeholder = null;

    tasks.forEach(task => {
      task.setAttribute('draggable', 'true'); // Make sure each task is draggable
      task.addEventListener('dragstart', (e) => {
        draggedItem = task;
        placeholder = createPlaceholder();
        setTimeout(() => {
          task.style.display = 'none';
        }, 0);
      });

      task.addEventListener('dragend', () => {
        if (placeholder) placeholder.remove();
        draggedItem.style.display = 'flex';
        draggedItem = null;
      });
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      if (!afterElement) {
        container.appendChild(placeholder);
      } else {
        container.insertBefore(placeholder, afterElement);
      }
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      if (placeholder && draggedItem) {
        container.insertBefore(draggedItem, placeholder);
        placeholder.remove();
      }
    });
  };

  const disableDragAndDrop = (container) => {
    const tasks = container.querySelectorAll('.roadmap-item__task');
    tasks.forEach(task => {
      task.removeAttribute('draggable');
    });
    container.classList.add('hidden'); 
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.roadmap-item__task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  const updateDragAndDropState = () => {
    containers.forEach(container => {
      if (window.innerWidth > 992) {
        container.classList.remove('hidden');
        enableDragAndDrop(container); 
      } else {
        disableDragAndDrop(container); 
      }
    });
  };

swiper.update();
  updateDragAndDropState();

  window.addEventListener('resize', updateDragAndDropState);
});


// slider
const swiper = new Swiper('.news-slider', {
  slidesPerView: 2,
  spaceBetween: 90,
  allowTouchMove: true,
  loop: false,
  breakpoints: {
    992: {
      slidesPerView: 2,
      spaceBetween: 90,
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,
    }
  }
  
});


(async () => {
  const GRAPHQL_ENDPOINT = 'https://node.xian.org/graphql'; // Replace with your actual endpoint
  const ITEMS_PER_PAGE =3;

  // First GraphQL query to fetch the latest token contracts
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

  try {
    const contractsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: contractsQuery,
        variables: { first: ITEMS_PER_PAGE }
      })
    });

    const contractsData = await contractsResponse.json();
    const contracts = contractsData.data.allContracts.nodes;

    if (!contracts.length) return;

    // Prepare metadata keys
    const metaKeys = contracts.flatMap(({ name }) => [
      `${name}.metadata:token_name`,
      `${name}.metadata:token_symbol`
    ]);

    // Second GraphQL query to fetch metadata
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
      body: JSON.stringify({
        query: metadataQuery,
        variables: { keys: metaKeys }
      })
    });

    const metadataData = await metadataResponse.json();
    const metadataEdges = metadataData.data.allStates.edges;

    // Build a lookup map for metadata
    const metadataMap = {};
    metadataEdges.forEach(({ node }) => {
      const [contractKey, field] = node.key.split(':');
      const contractName = contractKey.replace('.metadata', '');
      if (!metadataMap[contractName]) metadataMap[contractName] = {};
      metadataMap[contractName][field] = node.value;
    });

    // Populate the token grid
    const tokenGrid = document.getElementById('token-grid');
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
})();

async function fetchXianStats() {
  const container = document.getElementById("xian-stats-container");
  const graphqlUrl = "https://node.xian.org/graphql";
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
      fetch(graphqlUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: nowQuery }) }).then(r => r.json()),
      fetch(graphqlUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: volumeQuery }) }).then(r => r.json()),
      fetch(graphqlUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: countQuery }) }).then(r => r.json()),
      fetch(graphqlUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: excludedQuery }) }).then(r => r.json())
    ]);

    const totalCount = resCount.data.allStates.totalCount;
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

      const chunkResp = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chunkQuery, variables: { first: CHUNK_SIZE, offset } })
      }).then(r => r.json());

      const chunkValues = chunkResp.data.allStates.edges.map(e => parseFloat(e.node.value));
      totalSupply += chunkValues.reduce((a, b) => a + b, 0);
    }

    const excludedMap = Object.fromEntries(
      resExcluded.data.allStates.edges.map(e => [e.node.key, parseFloat(e.node.value)])
    );

    const treasury = excludedMap["currency.balances:dao"] || 0;
    const vesting = excludedMap["currency.balances:con_team_y1_linear_vesting"] || 0;
    const locker = excludedMap["currency.balances:team_lock"] || 0;
    const stream = excludedMap["currency.balances:dao_funding_stream"] || 0;

    const circulating = totalSupply - (treasury + vesting + locker + stream);

    const latest = resNow.data.allEvents.edges?.[0]?.node.data || {};
    const volumeEvents = resVol.data.allEvents.edges.map(e => e.node.data);

    let a0in = parseFloat(latest.amount0In || 0);
    let a1out = parseFloat(latest.amount1Out || 0);
    let a1in = parseFloat(latest.amount1In || 0);
    let a0out = parseFloat(latest.amount0Out || 0);
    let currentPrice = 0;

    if (a0in > 0 && a1out > 0) currentPrice = a0in / a1out;
    else if (a1in > 0 && a0out > 0) currentPrice = a0out / a1in;

    let volume = 0;
    let firstPrice = 0;
    for (const d of volumeEvents) {
      volume += parseFloat(d.amount0In || 0);
      volume += parseFloat(d.amount0Out || 0);
      if (!firstPrice) {
        if (parseFloat(d.amount0In) > 0 && parseFloat(d.amount1Out) > 0) {
          firstPrice = parseFloat(d.amount0In) / parseFloat(d.amount1Out);
        } else if (parseFloat(d.amount1In) > 0 && parseFloat(d.amount0Out) > 0) {
          firstPrice = parseFloat(d.amount0Out) / parseFloat(d.amount1In);
        }
      }
    }

    const change = firstPrice ? ((currentPrice - firstPrice) / firstPrice) * 100 : null;
    const marketCap = currentPrice * circulating;

    // Don't update the hero stats container - keep the static description
    // The hero container now shows static XIAN token description instead of live stats

    // 💹 Pie Chart Rendering
    const ctx = document.getElementById('xianPieChart')?.getContext('2d');
    const isMobile = window.innerWidth <= 600;
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: isMobile ? 'bottom' : 'right',
          labels: {
            color: '#ffffff',
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: 'Live $XIAN Token Distribution',
          color: '#ffffff',
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      }
    };
    if (ctx) {
      if (window.xianPieChart && typeof window.xianPieChart.destroy === "function") {
        window.xianPieChart.destroy();
      }
        window.xianPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ["Validator DAO Treasury", "Validator DAO Vesting", "Team Locker", "Team Vesting", "Circulating"],
          datasets: [{
            data: [treasury, stream, locker, vesting, circulating],
            backgroundColor: [
              "#06e6cb",  // Xian brand teal - Validator DAO Treasury
              "#f39c12",  // Bright orange - Validator DAO Vesting
              "#9b59b6",  // Purple - Team Locker  
              "#45b7d1",  // Sky blue - Team Vesting
              "#96ceb4"   // Sage green - Circulating
            ],
            borderColor: [
              "#04b8a3",  // Darker teal border
              "#d68910",  // Darker orange border
              "#7d3c98",  // Darker purple border
              "#3a9bc1",  // Darker blue border
              "#7fb89a"   // Darker green border
            ],
            borderWidth: 2
          }]
        },
        options: chartOptions
      });
    }

  } catch (err) {
    console.error("Failed to load XIAN stats", err);
    // Don't update the container on error - keep the static description
  }
}



fetchXianStats();
setInterval(fetchXianStats, 60_000); // refresh every minute

// Trello API Integration for Roadmap
(async function loadTrelloRoadmap() {
  // TODO: Replace these with your actual Trello API credentials
  // Get your API key from: https://trello.com/app-key
  // Generate a token from the same page with read permissions
  const TRELLO_API_KEY = '64bf6ed58b22612665e33f138afd3682'; // Your API key
  const TRELLO_TOKEN = '394a78dc07ac474b43206741c4087515075e8809e55dc75d8179daadb19e704f'; // Your token
  const BOARD_ID = '3yPhI9gn'; // Xian roadmap board ID
  
  // Trello label color mapping
  const labelColors = {
    'green': '#61bd4f',
    'yellow': '#f2d600', 
    'orange': '#ff9f1a',
    'red': '#eb5a46',
    'purple': '#c377e0',
    'blue': '#0079bf',
    'sky': '#00c2e0',
    'lime': '#51e898',
    'pink': '#ff78cb',
    'black': '#4d4d4d',
    'null': '#b3bac5' // default/no color
  };
  
  // Function to render labels as badges
  function renderLabels(labels) {
    if (!labels || labels.length === 0) return '';
    
    const labelsHTML = labels.map(label => {
      const color = labelColors[label.color] || labelColors['null'];
      const name = label.name || 'Unlabeled';
      
      return `
        <span class="roadmap-label" style="
          display: inline-block; 
          background: ${color}; 
          color: white; 
          padding: 0.2rem 0.5rem; 
          border-radius: 12px; 
          font-size: 0.75rem; 
          font-weight: 500; 
          margin-right: 0.5rem; 
          margin-bottom: 0.25rem;
          text-shadow: 0 1px 1px rgba(0,0,0,0.3);
          white-space: nowrap;
        " title="${name}">${name}</span>
      `;
    }).join('');
    
    return `<div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">${labelsHTML}</div>`;
  }
  
  const roadmapContainer = document.getElementById('roadmap-content');
  
  // Skip API call if credentials aren't set up yet
  if (TRELLO_API_KEY === 'YOUR_TRELLO_API_KEY' || TRELLO_TOKEN === 'YOUR_TRELLO_TOKEN') {
    roadmapContainer.innerHTML = `
      <div class="api-setup-notice" style="text-align: center; padding: 2rem; background: rgba(6, 230, 203, 0.1); border: 1px solid rgba(6, 230, 203, 0.3); border-radius: 8px;">
        <h3 style="color: #06e6cb; margin-bottom: 1rem;">Trello API Setup Required</h3>
        <p style="margin-bottom: 1rem;">To display live roadmap data, please:</p>
        <ol style="text-align: left; max-width: 500px; margin: 0 auto;">
          <li>Get your API key from <a href="https://trello.com/app-key" target="_blank" style="color: #06e6cb;">trello.com/app-key</a></li>
          <li>Generate a token with read permissions</li>
          <li>Replace the placeholder values in main.js</li>
        </ol>
      </div>
    `;
    return;
  }
  
  try {
    // Test API key first with a simple call
    console.log('Testing Trello API connection...');
    console.log('API Key:', TRELLO_API_KEY);
    console.log('Token length:', TRELLO_TOKEN.length);
    
    // Fetch board data with lists and cards (including labels)
    const boardResponse = await fetch(`https://api.trello.com/1/boards/${BOARD_ID}?lists=open&cards=open&card_labels=true&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
    
    console.log('Response status:', boardResponse.status);
    console.log('Response headers:', [...boardResponse.headers.entries()]);
    
    if (!boardResponse.ok) {
      const errorText = await boardResponse.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Trello API error: ${boardResponse.status} - ${errorText}`);
    }
    
    const boardData = await boardResponse.json();
    
    // Fetch lists with cards and labels
    const listsResponse = await fetch(`https://api.trello.com/1/boards/${BOARD_ID}/lists?cards=open&card_labels=true&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
    const lists = await listsResponse.json();
    
    // Generate HTML for the roadmap
    let roadmapHTML = `
      <div class="roadmap-lists" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
    `;
    
    lists.forEach(list => {
      const cardCount = list.cards.length;
      roadmapHTML += `
        <div class="roadmap-list" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1);">
          <h3 style="color: #06e6cb; margin-bottom: 1rem; font-size: 1.25rem;">${list.name}</h3>
          <div class="roadmap-cards">
      `;
      
      if (cardCount === 0) {
        roadmapHTML += `<p style="opacity: 0.7; font-style: italic;">No items yet</p>`;
      } else {
        list.cards.forEach(card => {
          const labelsHTML = renderLabels(card.labels);
          roadmapHTML += `
            <div class="roadmap-card" style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid #06e6cb;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${card.name}</h4>
              ${labelsHTML ? `<div style="margin-bottom: 0.5rem;">${labelsHTML}</div>` : ''}
              ${card.desc ? `<p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">${card.desc.substring(0, 150)}${card.desc.length > 150 ? '...' : ''}</p>` : ''}
            </div>
          `;
        });
      }
      
      roadmapHTML += `
          </div>
        </div>
      `;
    });
    
    roadmapHTML += `</div>`;
    
    // Update the container
    roadmapContainer.innerHTML = roadmapHTML;
    
  } catch (error) {
    console.error('Error loading Trello roadmap:', error);
    
    // Try alternative approach with public board JSON
    console.log('Trying alternative public board approach...');
    try {
      const publicBoardResponse = await fetch(`https://trello.com/b/${BOARD_ID}.json`);
      if (publicBoardResponse.ok) {
        const publicBoardData = await publicBoardResponse.json();
        console.log('Public board data:', publicBoardData);
        
        // Process public board data
        let roadmapHTML = `
          <div class="roadmap-lists" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
        `;
        
        publicBoardData.lists.forEach(list => {
          if (list.closed) return; // Skip closed lists
          
          const cards = publicBoardData.cards.filter(card => card.idList === list.id && !card.closed);
          
          roadmapHTML += `
            <div class="roadmap-list" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1);">
              <h3 style="color: #06e6cb; margin-bottom: 1rem; font-size: 1.25rem;">${list.name}</h3>
              <div class="roadmap-cards">
          `;
          
          if (cards.length === 0) {
            roadmapHTML += `<p style="opacity: 0.7; font-style: italic;">No items yet</p>`;
          } else {
            cards.forEach(card => {
              const labelsHTML = renderLabels(card.labels);
              roadmapHTML += `
                <div class="roadmap-card" style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid #06e6cb;">
                  <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${card.name}</h4>
                  ${labelsHTML ? `<div style="margin-bottom: 0.5rem;">${labelsHTML}</div>` : ''}
                  ${card.desc ? `<p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">${card.desc.substring(0, 150)}${card.desc.length > 150 ? '...' : ''}</p>` : ''}
                </div>
              `;
            });
          }
          
          roadmapHTML += `
              </div>
            </div>
          `;
        });
        
        roadmapHTML += `</div>`;
        roadmapContainer.innerHTML = roadmapHTML;
        return; // Success with public board
        
      }
    } catch (publicError) {
      console.error('Public board approach also failed:', publicError);
    }
    
    roadmapContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 8px;">
        <h3 style="color: #ff6b6b; margin-bottom: 1rem;">Error Loading Roadmap</h3>
        <p>Unable to fetch roadmap data from Trello.</p>
        <div style="text-align: left; max-width: 500px; margin: 1rem auto; font-size: 0.9rem; opacity: 0.8;">
          <strong>Possible solutions:</strong>
          <ul>
            <li>Make sure your Trello board is <strong>public</strong></li>
            <li>Verify your API key and token from <a href="https://trello.com/app-key" target="_blank" style="color: #06e6cb;">trello.com/app-key</a></li>
            <li>Check browser console for detailed error messages</li>
            <li>Ensure your token has read permissions for the board</li>
          </ul>
        </div>
        <p style="font-size: 0.9rem; opacity: 0.8;">Error: ${error.message}</p>
      </div>
    `;
  }
})();

