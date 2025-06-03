// if (window.location.protocol === "http:") {
//   window.location.href = window.location.href.replace("http:", "https:");
// }
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

  const rssFeedUrl = "https://api.cors.lol/?url=https://xiannetwork.medium.com/feed";
  const newsContainer = document.getElementById("news-container");

  fetch(rssFeedUrl)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const items = xmlDoc.querySelectorAll("item");

      items.forEach((item, index) => {
        if (index >= 3) return; // Limit to 8 posts
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        const content = item.querySelector("content\\:encoded, encoded").textContent;
        const thumbnail = extractThumbnail(content);
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        slide.innerHTML = `
          <div class="swiper-slide__block">
            <a href="${link}" target="_blank"><h3>${title}</h3></a>
            ${truncateText(removeFigures(content), 100)}
            <a href="${link}" target="_blank">Read more</a>
          </div>
          <div class="swiper-slide__img">
            <img src="${thumbnail}" alt="News Thumbnail" onerror="this.src='./assets/img/news-img.png'">
          </div>
        `;
        newsContainer.appendChild(slide);
      });
    })
    .catch(error => console.error("Error fetching Medium RSS feed:", error));
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
      edges { node { value } }
    }
  }`;

  try {
    // Fetch price, volume, excluded balances, and total count in parallel
    const [resNow, resVol, resCount, resExcluded] = await Promise.all([
      fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: nowQuery })
      }).then(r => r.json()),
      fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: volumeQuery })
      }).then(r => r.json()),
      fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: countQuery })
      }).then(r => r.json()),
      fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: excludedQuery })
      }).then(r => r.json())
    ]);

    const totalCount = resCount.data.allStates.totalCount;
    let totalSupply = 0;

    // Chunked summing
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
        body: JSON.stringify({
          query: chunkQuery,
          variables: { first: CHUNK_SIZE, offset }
        })
      }).then(r => r.json());

      const chunkValues = chunkResp.data.allStates.edges.map(e => parseFloat(e.node.value));
      totalSupply += chunkValues.reduce((a, b) => a + b, 0);
    }

    const excluded = resExcluded.data.allStates.edges
      .map(e => parseFloat(e.node.value))
      .reduce((a, b) => a + b, 0);

    const circulating = totalSupply - excluded;

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

    container.innerHTML = `
     <strong style="display: block; margin-bottom: 0.5rem;">$XIAN (Native Token on Xian Blockchain)</strong>
  <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.9rem;    justify-content: center;">
    <li><span style="opacity: 0.75;">Price:</span> <strong>$${currentPrice.toLocaleString("en-US", {maximumFractionDigits: 4})}</strong></li>
    <li><span style="opacity: 0.75;">Market Cap:</span> <strong>$${marketCap.toLocaleString("en-US")}</strong></li>
    <li><span style="opacity: 0.75;">Circulating:</span> <strong>${Math.floor(circulating).toLocaleString("en-US")} XIAN</strong></li>
    <li><span style="opacity: 0.75;">24h Vol:</span> <strong>$${volume.toLocaleString("en-US", {maximumFractionDigits: 0})}</strong></li>
  </ul>
  <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 0.75rem;">
    These stats reflect the <strong>native $XIAN token</strong> on the Xian blockchain. 
  Prices and supply may differ from bridged tokens listed on Solana.
  </div>
    `;
  } catch (err) {
    console.error("Failed to load XIAN stats", err);
    container.textContent = "Error loading $XIAN stats.";
  }
}


fetchXianStats();
setInterval(fetchXianStats, 60_000); // refresh every minute
