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

  updateDragAndDropState();

  window.addEventListener('resize', updateDragAndDropState);
});


// slider
const swiper = new Swiper('.news-slider', {
  slidesPerView: 2,
  spaceBetween: 90,
  allowTouchMove: true,
  loop: true,
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

