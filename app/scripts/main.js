'use strict';

const THEME_COOKIE_NAME = 'theme';
const THEME_CLASS_NAME  = 'theme-compact';

var resizeTimer;

function initTheme(){
  if(getCookie(THEME_COOKIE_NAME) === THEME_CLASS_NAME) {
    $('body').addClass(THEME_CLASS_NAME);
  };
}

function initDescriptionMoreLinks(){
  $('.js-note_item__description').each(function(){
    if ($(this).height() < $(this).find('.note_item__description-wrapper').height()) {
      $(this).append('<span class="note_item__description-more"><i class="fa fa-plus-square-o" aria-hidden="true"></span>');
    }
  });
}


/* ------------------------------------------------------- */
/* "MAIN" */

var TheNoteList = new NoteList();

initTheme();
initDescriptionMoreLinks();

$(window).on('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    initDescriptionMoreLinks();
  }, 200);
});

/* ------------------------------------------------------- */


