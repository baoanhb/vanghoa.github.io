document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages;    
  
    if ("IntersectionObserver" in window) {
      lazyloadImages = document.querySelectorAll(".lazy");
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            imageObserver.unobserve(image);
          }
        });
      });
  
      lazyloadImages.forEach(function(image) {
        imageObserver.observe(image);
      });

    } else {  
      var lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll(".lazy");
      
      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }    
  
        lazyloadThrottleTimeout = setTimeout(function() {
          var scrollTop = window.pageYOffset;
          lazyloadImages.forEach(function(img) {
              if(img.offsetTop < (window.innerHeight + scrollTop)) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
              }
          });
          if(lazyloadImages.length == 0) { 
            document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
          }
        }, 20);
      }
  
      document.addEventListener("scroll", lazyload);
      window.addEventListener("resize", lazyload);
      window.addEventListener("orientationChange", lazyload);
    }
})

// nav fetch //
fetch('../../item.json')
                .then(res => res.json())
                .then(data => {
                  item_field_gen(data[+window.location.pathname.split('/')[2] - 1]);
                })
                .catch(err => console.error(err));

function item_field_gen(item) {
  let divtxt = document.createElement('p'); divtxt.className = 'field_p';

  for (let index in item.field) {
    let span = document.createElement('span');
    span.className = `field ${item.field[index].class}`;//-- json props
    span.textContent = item.field[index].name;//-- json props
    divtxt.append(span,' ');
  }

  let h1 = document.querySelector('h1');
  h1.parentNode.insertBefore(divtxt, h1.nextSibling);
}