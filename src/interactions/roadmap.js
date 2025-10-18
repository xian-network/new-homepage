import { TRELLO_BOARD_ID } from './constants.js';
import { openCardModal } from './modals.js';
import { parseMarkdown, renderLabels } from './roadmapContent.js';

export async function loadTrelloRoadmap() {
  const roadmapContainer = document.getElementById('roadmap-content');
  if (!roadmapContainer) return;

  try {
    const publicBoardResponse = await fetch(
      `https://trello.com/b/${TRELLO_BOARD_ID}.json`
    );

    if (!publicBoardResponse.ok) {
      throw new Error(`Public board fetch failed with status ${publicBoardResponse.status}`);
    }

    const publicBoardData = await publicBoardResponse.json();
    if (publicBoardData?.cards && publicBoardData?.lists) {
      let roadmapHTML = '<div class="roadmap-lists" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 2rem; margin-top: 2rem;">';

      publicBoardData.lists.forEach((list) => {
        if (list.closed) return;
        const cards = publicBoardData.cards.filter((card) => card.idList === list.id && !card.closed);
        roadmapHTML += `
          <div class="roadmap-list" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.5rem; border:1px solid rgba(255, 255, 255, 0.1);">
            <h3 style="color: #06e6cb; margin-bottom: 1rem; font-size: 1.25rem;">${list.name}</h3>
            <div class="roadmap-cards">
        `;

        if (cards.length === 0) {
          roadmapHTML += '<p style="opacity: 0.7; font-style: italic;">No items yet</p>';
        } else {
          const limitedCards = cards.slice(0, 6);
          limitedCards.forEach((card) => {
            const labelsHTML = renderLabels(card.labels || []);
            const hasDescription = card.desc && card.desc.trim().length > 0;
            roadmapHTML += `
              <div class="roadmap-card" style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid #06e6cb; position: relative;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${card.name}</h4>
                ${labelsHTML ? `<div style="margin-bottom: 0.5rem;">${labelsHTML}</div>` : ''}
                ${hasDescription ? `
                  <button class="read-more-btn" data-card-id="${card.id}" data-card-title="${card.name.replace(/"/g, '&quot;')}" data-card-desc='${card.desc.replace(/'/g, '&#39;')}' data-card-labels='${JSON.stringify(card.labels || []).replace(/'/g, '&#39;')}'>
                    Read more
                  </button>
                ` : ''}
              </div>
            `;
          });

          if (cards.length > 6) {
            roadmapHTML += `<div style="text-align: center; margin-top: 0.5rem; opacity: 0.7; font-size: 0.9rem;">Showing 6 of ${cards.length} items</div>`;
          }
        }

        roadmapHTML += '</div></div>';
      });

      roadmapHTML += '</div>';
      roadmapContainer.innerHTML = roadmapHTML;
      return;
    }
  } catch (error) {
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
}

export function initRoadmapInteractions(cleanups) {
  const roadmapContent = document.getElementById('roadmap-content');
  if (!roadmapContent) return;

  const handleClick = (event) => {
    const readMoreBtn = event.target.closest('.read-more-btn');
    if (!readMoreBtn) return;
    event.preventDefault();
    const title = readMoreBtn.getAttribute('data-card-title') || '';
    const description = readMoreBtn.getAttribute('data-card-desc') || '';
    const labelsJSON = readMoreBtn.getAttribute('data-card-labels') || '[]';

    try {
      const labels = JSON.parse(labelsJSON);
      openCardModal('', title, description, labels);
    } catch (error) {
      openCardModal('', title, description, []);
    }
  };

  roadmapContent.addEventListener('click', handleClick);
  cleanups.push(() => roadmapContent.removeEventListener('click', handleClick));
}

export { parseMarkdown, renderLabels };
