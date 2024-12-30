// Smoose Scroll
$('a[href*="#"]').on('click', function() {
	$('html, body').animate({
		scrollTop: $($.attr(this, 'href')).offset().top - 100
	}, 3000);
	return false;
});

// Stiky Menu
$(document).ready(function($){
	var nav = $('.header');
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			nav.addClass("fixed");
		} else {
			nav.removeClass("fixed");
		}
	});
});

// Fixed Menu
// $(document).ready(function() {
//     var start_pos=$('.header').offset().top;
//         $(window).scroll(function(){
//         if ($(window).scrollTop()>=start_pos) {
//             if ($('.header').hasClass()==false) $('.header').addClass('fixed');
//         }
//         else $('.header').removeClass('fixed');
//     });
// });

// Burger Header Menu
$(function() {
	$('.burger').click(function() {
		$('.menu,.burger').toggleClass('active');
		$('body').toggleClass('lock');
	});
	$('.menu a').click(function() {
		$('.menu,.burger').toggleClass('active');
		$('body').toggleClass('lock');
	});
});

// Burger Bottom Menu
$(function() {
	$('.mobburger').click(function() {
		$('.mobmenu,.mobburger').toggleClass('active');
		$('body').toggleClass('lock');
	});
	$('.mobMenu a').click(function() {
		$('.mobmenu,.mobburger').toggleClass('active');
		$('body').toggleClass('lock');
	});
});

// Mobile Menu with Submenu
let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
let body=document.querySelector('body');
if(isMobile.any()){
	body.classList.add('touch');
	let arrow=document.querySelectorAll('.arrow');
	for(i=0; i<arrow.length; i++){
		let thisLink=arrow[i].previousElementSibling;
		let subMenu=arrow[i].nextElementSibling;
		let thisArrow=arrow[i];
		
		thisLink.classList.add('parent');
		arrow[i].addEventListener('click', function(){
			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('active');
		});
	}
}else{
	body.classList.add('mouse');
}

// Animation
document.addEventListener('DOMContentLoaded', () => {
	const heartsContainer = document.querySelector('.hearts-animation');
  
	// Function to create a heart
	function createHeart() {
	  const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	  heart.setAttribute('class', 'heart');
	  heart.setAttribute('viewBox', '0 0 24 22');
	  heart.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	  heart.setAttribute('width', '24');
	  heart.setAttribute('height', '22');
	  heart.innerHTML = `
		<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF0000"/>
	  `;
	  return heart;
	}
  
	// Create 15 hearts with random positions and animations
	for (let i = 0; i < 15; i++) {
	  const heart = createHeart();
	  heartsContainer.appendChild(heart);
  
	  // Set random initial position (percentage)
	  const randomX = Math.random() * 100;
	  const randomY = Math.random() * 100;
  
	  // Set the heart's initial position
	  heart.style.position = 'absolute';
	  heart.style.left = `${randomX}%`;
	  heart.style.top = `${randomY}%`;
	  heart.style.opacity = Math.random() * 0.5 + 0.5; // Random opacity
  
	  // Set random movement ranges (distance the heart will travel)
	  const randomXMovement = Math.random() * 100 - 50; // Between -50% and 50%
	  const randomYMovement = Math.random() * 100 - 50; // Between -50% and 50%
  
	  // Set the animation for the heart to move constantly across the screen
	  heart.style.animation = `move-heart 10s infinite linear, pulse-heart 2s infinite ease-in-out`;
  
	  // Set movement direction using CSS variables
	  heart.style.setProperty('--moveX', `${randomXMovement}%`);
	  heart.style.setProperty('--moveY', `${randomYMovement}%`);
	}
  });