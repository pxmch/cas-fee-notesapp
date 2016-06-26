'use strict';

/**
 * event handler
 */


/* ------------------------------------------------------------- */
/* NOTE LIST GENERAL */

// refresh the list
$('.note_list').on('notelist:refresh', function(e, options){
  var source = $('#node_item_template').html();
  var template = Handlebars.compile(source);
  var displayList = options;
  $('.note_list').html(template(displayList));
  initDescriptionMoreLinks();
})


/* ------------------------------------------------------------- */
/* NOTE LIST HEADER */

// open new item dialog
$('.js-button-add-item').on('click', function() {
  $('#edit-menu-title').text('Add note');
  $('.edit-dialog').data('mode', 'add')
  toggleEditMask('show');
});

// menu toggle (show/hide menu on mobile)
$('.js-menu-toggle').on('click', function() {
  $('.app-toolbar').toggleClass('app-toolbar--hidden');
});

// style toggle
$('.js-style-toggle').on('click', function() {
  $('body').toggleClass(THEME_CLASS_NAME);
  var cval = $('body').hasClass(THEME_CLASS_NAME) ? THEME_CLASS_NAME : 'default';
  setCookie(THEME_COOKIE_NAME, cval, 30);
});

// sort items
$('#js-sort-by-duedate').on('click', function() {
  $(this).toggleClass('desc');
  var order = $(this).hasClass('desc') ? 'desc' : 'asc';
  TheNoteList.sortItems('duedate', order);
  updateSortIndicators($(this), order);
});
$('#js-sort-by-createdate').on('click', function() {
  $(this).toggleClass('desc');
  var order = $(this).hasClass('desc') ? 'desc' : 'asc';
  TheNoteList.sortItems('createdate', order);
  updateSortIndicators($(this), order);
});
$('#js-sort-by-priority').on('click', function() {
  $(this).toggleClass('desc');
  var order = $(this).hasClass('desc') ? 'desc' : 'asc';
  TheNoteList.sortItems('priority', order);
  updateSortIndicators($(this), order);
});

// filter items
$('#js-filter-done').on('click', function() {
  var icon = (TheNoteList.toggleShowFinished()) ? 'eye' : 'eye-slash';
  $(this).find('.js-filter-done-indicator').removeClass('fa-eye fa-eye-slash').addClass('fa-'+icon);
});


/* ------------------------------------------------------------- */
/* NOTE ITEMS */

// edit item
$('.note_list').on('click', '.js-button-edit-item',  function () {
  var index = $(this).data('id');
  var item = TheNoteList.getItem(index);

  $('#edit-id').val(item._id);
  $('#edit-isDone').val(item.isDone);
  $('#edit-title').val(item.title);
  $('#edit-description').val(item.description);
  $('input[name="edit-priority"][value="'+item.priority+'"]').prop('checked', true);

  if(item.duedate !== 0) {
    $('#edit-duedate').val(getFormattedDate(new Date(item.duedate)));
  }

  $('#edit-menu-title').text('Edit note');
  toggleEditMask('show');
  $('.edit-dialog').data('mode', 'edit').data('index', index);
});

// handle item checkbox
$('.note_list').on('click', '.js-item-flag-done', function() {
  var item = TheNoteList.getItem($(this).data('id'));
  if($(this).prop('checked')) {
    item.isDone = true;
    item.finishdate = Date.now();
  }
  else {
    item.isDone = false;
    item.finishdate = null;
  }
  TheNoteList.replaceItem($(this).data('id'), item);
});

// handle description overflow
$('.note_list').on('click', '.js-note_item__description', function() {
  $(this).toggleClass('note_item__description--expanded');

  var $more = $(this).find('.note_item__description-more .fa');
  $more.removeClass('fa-plus-square-o fa-minus-square-o');
  $more.addClass(($(this).hasClass('note_item__description--expanded')) ? 'fa-minus-square-o' : 'fa-plus-square-o');
});

//re-evaluate description 'more' links
$(window).on('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    initDescriptionMoreLinks();
  }, 200);
});


/* ------------------------------------------------------------- */
/* EDIT MASK */

// cancel button (cancel edit mask)
$('.js-button-item-cancel').on('click', function() {
  toggleEditMask('hide');
});

// save button (add/update item)
$('.js-btn-item-save').on('click', function() {
  var title = $('#edit-title').val();
  var description = $('#edit-description').val();
  var priority = 0;
  var duedate = 0;
  var _id = $('#edit-id').val();
  var isDone = ($('#edit-isDone').val() == 'true') ? true : false;

  if ($('input[name="edit-priority"]:checked').val()) {
    priority = parseInt($('input[name="edit-priority"]:checked').val());
  }
  if($('#edit-duedate').val() !== ''){
    duedate = Date.parse($('#edit-duedate').val())
  }

  var item = new Note(title, description, priority, duedate, isDone, _id);

  if($('.edit-dialog').data('mode') == 'edit') {
    var index = $('.edit-dialog').data('index');
    TheNoteList.replaceItem(index, item);
  } else {
    TheNoteList.addItem(item);
  }
  toggleEditMask('hide');
});

// delete button (delete an item)
$('.js-button-delete-item').on('click', function() {
  if(window.confirm('Delete this note?')) {
    var index = $('.edit-dialog').data('index');
    var _id = $('#edit-id').val();
    TheNoteList.deleteItem(index, _id);
    toggleEditMask('hide');
  }
});

// today button (for due date)
$('.js-btn-duedate-today').on('click', function() {
  $('#edit-duedate').val(getToday());
});

// tomorrow button (for due date)
$('.js-btn-duedate-tomorrow').on('click', function() {
  $('#edit-duedate').val(getTomorrow());
});

// reset prio button
$('.js-btn-reset-prio').on('click', function() {
  $('.edit-priority').attr('checked', false);
});

