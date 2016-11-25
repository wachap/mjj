import $ from 'jquery'

const $nav = $('.js-site-nav')
export const $lis = $nav.find('li')
export const $hamburger = $('.js-hamburger')
const animationDuration = 300
let isAnimating = false
let isOpen = false

/**
 * Toggle hamburger and nav
 */
function toggleHamburger (event) {
  if (isAnimating) return
  isAnimating = true

  let time = 0

  $nav.toggleClass('is-open')
  $hamburger.toggleClass('is-open')

  if (isOpen) {
    $lis.each(function () {
      $(this).velocity('stop')
      .velocity('reverse')
    })

    isOpen = false
  } else {
    $lis.each(function () {
      $(this).velocity('stop')
      .velocity({
        opacity: '1'
      }, {
        duration: 800,
        delay: time,
        easing: [
          60, 10
        ]
      })

      time += 120
    })

    isOpen = true
  }

  setTimeout(() => {
    isAnimating = false
  }, animationDuration)
}

export default toggleHamburger
