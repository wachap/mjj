import 'src/styles/main.scss'

// jquery plugins
window.jQuery = window.$ = require('jquery')
// require('velocity-animate')
require('materialize-css/js/jquery.easing.1.3')
require('materialize-css/js/animation')
require('materialize-css/js/velocity.min')
require('materialize-css/js/global')
require('materialize-css/js/scrollspy')

import debounce from 'lodash.debounce'
import ScrollReveal from 'scrollreveal'
import toggleHamburger, {$lis, $hamburger} from './modules/nav'

window.sr = ScrollReveal({
  mobile: false,
  origin: 'bottom',
  duration: 800
})

function inLaptopScreen () {
  return window.matchMedia('(min-width: 1024px)').matches
}

function onWindowResize (event) {
  if (inLaptopScreen()) {
    $lis.off('click', toggleHamburger)
  } else {
    $lis.on('click', toggleHamburger)
  }
}

$hamburger.on('click', toggleHamburger)

if (!inLaptopScreen()) {
  $lis.on('click', toggleHamburger)
}

$(window).on('resize', debounce(onWindowResize, 300))

$('.js-scrollspy').scrollSpy({
  scrollOffset: 60
})

window.sr.reveal('.js-sr-services', {
  easing: 'ease-in-out',
  distance: '20px',
  scale: 1
}, 150)

window.sr.reveal('.js-sr-contact', {
  easing: 'ease-in-out',
  distance: '20px',
  scale: 1
}, 150)

window.sr.reveal('.js-sr-hero', {
  easing: 'ease-in-out',
  distance: '20px',
  scale: 1
}, 200)

window.sr.reveal('.js-sr-about', {
  easing: 'ease-in-out',
  distance: '20px',
  scale: 1
}, 200)

// fix side effects on HMR
if (module.hot) {
  module.hot.accept(() => {
    window.reload()
  })
}
