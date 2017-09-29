var $logos = $('.js-logo-alt')

function debounce(func, wait, immediate) {
    var timeout
    return function() {
        var context = this, args = arguments
        var later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

var $body = $('body')
var $logoMain = $('.js-logo-main')
var $logoMainMask = $('#logo-main-mask rect')
var $logoAltMask = $('#logo-alt-mask rect')
var logoDimensions = {
    width: $logoMain.outerWidth(),
    height: $logoMain.outerHeight()
}
var $sections = $('.section')
var sections = generateSectionsMap()
var maskCache = {}

function setLogoMasks(isDark, amount) {
    if ((maskCache.isDark === isDark) && (maskCache.amount === amount)) {
        return
    }

    var alt = {}
    var main = {}

    if (isDark) {
        alt.y = amount + 1
        alt.height = logoDimensions.height - amount

        main.y = 0
        main.height = amount
    } else {
        alt.y = 0
        alt.height = amount

        main.y = amount
        main.height = logoDimensions.height - amount
    }

    $logoAltMask.attr({
        y: alt.y,
        height: alt.height
    })

    $logoMainMask.attr({
        y: main.y,
        height: main.height
    })

    maskCache.isDark = isDark
    maskCache.amount = amount
}

function generateSectionsMap() {
    var sections = []

    $sections.each(function () {
        var top = $(this).offset().top

        sections.push({
            $el: this,
            start: top,
            end: top + $(this).outerHeight(),
            isDark: $(this).hasClass('js-section-dark')
        })
    })

    return sections
}

function updateLogo(sections) {
    var scrollOffset = $body.scrollTop()
    var logoStart = $logoMain.offset().top
    var logoEnd = logoStart + logoDimensions.height
    var section

    $.each(sections, function (index, section) {
        if (section.end >= logoStart) {
            if (
                section.end <= logoEnd &&
                sections[index + 1] &&
                sections[index + 1].isDark !== section.isDark
            ) {
                setLogoMasks(section.isDark, section.end - logoStart)
            } else {
                setLogoMasks(section.isDark, logoDimensions.height)
            }

            return false
        }
    })
}

updateLogo(sections)

$(window).on('scroll', function () {
    updateLogo(sections)
})