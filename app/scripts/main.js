'use strict';

var THEME_COOKIE_NAME = 'theme';
var THEME_CLASS_NAME  = 'theme-compact';

var resizeTimer;

function initTheme(){
  if(getCookie(THEME_COOKIE_NAME) === THEME_CLASS_NAME) {
    $('body').addClass(THEME_CLASS_NAME);
  };
}

function initDescriptionMoreLinks(){
  // display 'more' link if needed
  $('.js-note_item__description').each(function(){
    if ($(this).height() < $(this).find('.note_item__description-wrapper').height()) {
      $(this).append('<span class="note_item__description-more"><i class="fa fa-plus-square-o" aria-hidden="true"></span>');
    }
  });
}

/* ------------------------------------------------------- */
/* MAIN */

var TheNoteList = new NoteList();
TheNoteList.init();

initTheme();
initDescriptionMoreLinks();





