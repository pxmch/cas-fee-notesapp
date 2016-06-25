$(function() {
  'use strict';

  const THEME_COOKIE_NAME = 'theme';
  const THEME_CLASS_NAME  = 'theme-compact';

  var resizeTimer;

  Handlebars.registerHelper('formattedDate', function(data) {
    if(data === 0) {
      return '';
    }
    var date = new Date(data);
    return getFormattedDate(date);
  });

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

  function getFormattedDate(date){
    var d = date;
    var month = (d.getMonth() + 1);
    var day = d.getDate();

    if(month < 10) {
      month = '0' + month;
    }
    if(day < 10) {
      day = '0' + day;
    }
    return d.getFullYear() + '-' + month + '-' + day;
  }

  function getToday(){
    return getFormattedDate(new Date(Date.now()));
  }

  function getTomorrow(){
    return getFormattedDate(new Date(Date.now()+24*60*60*1000));
  }

  function toggleEditMask(state){
    if(state == 'show') {
      $('.edit-dialog-backdrop').addClass('active');
      $('.edit-dialog').addClass('active');
      if($('.edit-dialog').data('mode') === 'add') {
        $('.edit-mask-delete-button').hide();
      }
    }
    else {
      $('.edit-dialog-backdrop').removeClass('active');
      $('.edit-dialog').removeClass('active').data('mode', '').data('index', '');
      $('#edit-mask')[0].reset();
      $('.edit-mask-delete-button').show();
    }
  }

  function updateSortIndicators($current, order){
    $('.js-sort-indicator').removeClass('fa-sort fa-sort-asc fa-sort-desc').parent().removeClass('active');
    $current.find('.js-sort-indicator').addClass('fa-sort-'+order).parent().addClass('active');

  }

  function setCookie (name, value, expiry){
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; max-age=' + 60 * 60 * 24 * expiry +
      '; path=/';
  }

  function getCookie (name){
    var cookies = document.cookie;
    if (cookies && cookies.length != 0) {
      var val = cookies.match('(^|;)[\s]*' + name + '=([^;]*)');
      if (val && val[2]) {
        return decodeURIComponent(val[2]);
      }
    }
    return '' ;
  }

  function NoteList() {

    const STORAGE_KEY = 'note-items';
    const SERVER = 'http://127.0.0.1:3001';
    const DATA_STATE_SYNCED = 1;
    const DATA_STATE_NEEDS_RESYNC = 2;
    const DATA_STATE_LOCAL_STORAGE = 3;
    const DATA_STATE_MEMORY_ONLY = 4;


    var self = this;
    self.items = [];
    self.showFinished = false;
    self.syncState = DATA_STATE_SYNCED;
    self.resyncQueue = [];

    self.getItem = function(index){
      return self.items[index];
    };

    self.addItem = function(item) {
      delete item['_id'];
      // save to server
      $.ajax({
        url: SERVER+'/note',
        type:'POST',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        success: function( data, status, jqXHR){
          var d=JSON.parse(data);
          item._id = d._id;
          // save locally
          self.items.push(item);
          storeItems();
        }
      }).fail(function(){
          self.syncState = DATA_STATE_NEEDS_RESYNC;
          self.resyncQueue.push(item);
          window.console && console.log('server store failed!');
          // save locally
          self.items.push(item);
          storeItems();
      });

    };

    self.replaceItem = function(index, item) {
      // save locally
      self.items.splice(index, 1, item);
      // save to server
      $.ajax({
        url: SERVER+'/note/'+item._id,
        type:'PUT',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        crossDomain: true
      }).fail(function(){
        self.syncState = DATA_STATE_NEEDS_RESYNC;
        self.resyncQueue.push(item);
        window.console && console.log('server store failed!');
      });
      storeItems();
    };

    self.deleteItem = function(index, id) {
      self.items.splice(index, 1);
      // delete from server
      $.ajax({
        url: SERVER+'/note/'+id,
        type:'DELETE',
        contentType: 'application/json; charset=utf-8',
        crossDomain: true
      }).fail(function(){
        window.console && console.log('server delete failed!');
      });
      storeItems();
    };

    self.toggleShowFinished = function() {
      self.showFinished = !self.showFinished;
      refreshList();
      return self.showFinished
    }

    self.sortItems = function(field, order) {
      switch(field) {
        case 'duedate':
          self.items.sort(function(a,b) {
            return (order == 'asc') ? parseInt(a.duedate) - parseInt(b.duedate) : parseInt(b.duedate) - parseInt(a.duedate);
          });
          break;
        case 'priority':
          self.items.sort(function(a,b) {
            return (order == 'asc') ? a.priority - b.priority : b.priority - a.priority;
          });
          break;
        case 'createdate':
          self.items.sort(function(a,b) {
            return (order == 'asc') ? parseInt(a.createdate) - parseInt(b.createdate) : parseInt(b.createdate) - parseInt(a.createdate);
          });
          break;
      }
      storeItems();
    }

    function hasStorage() {
      try {
        localStorage.setItem('test-storage', 'test');
        localStorage.removeItem('test-storage');
        return true;
      }
      catch (exception) {
        return false;
      }
    }

    function loadItems() {
      $.get( SERVER+'/all', function( data ) {
        // load from server
        self.items = JSON.parse(data);
        refreshList();
      }).fail(function(){
        window.console && console.log('loading items failed!');

        // load from local storage
        /*
        self.syncState = DATA_STATE_LOCAL_STORAGE;
        if (!hasStorage()){
          window.console && console.log('No local storage available!');
          return;
        }
        else if (localStorage.getItem(STORAGE_KEY)) {
          self.items = JSON.parse(localStorage.getItem(STORAGE_KEY));
          refreshList();
        }*/
      });
    }

    function storeItems() {
      if (!hasStorage()){
        alert('No local storage available.');
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(self.items));
      refreshList();
    }

    function refreshList() {
      var source = $('#node_item_template').html();
      var template = Handlebars.compile(source);
      var displayList = { showFinished: self.showFinished, items: self.items};
      $('.note_list').html(template(displayList));
      initDescriptionMoreLinks();
    };

    loadItems();
  }

  function Note(title, description, priority, duedate, isDone, _id) {
    var self = this;
    self._id = (typeof _id != 'undefined') ? _id : null;
    self.title = title;
    self.description = description;
    self.priority = (typeof priority != 'undefined' && !isNaN(priority)) ? priority : 0;;
    self.duedate = (typeof duedate != 'undefined' && !isNaN(duedate)) ? duedate : 0;
    self.isDone = (typeof isDone != 'undefined') ? isDone : false;
    self.createdate = Date.now();
    self.finishdate = 0;
  }

  /* ------------------------------------------------------- */
  /* "MAIN" */

  var TheNoteList = new NoteList();

  initTheme();
  initDescriptionMoreLinks();

  /* ------------------------------------------------------- */

  /* event handlers */

  // open new item dialog
  $('.js-button-add-item').on('click', function() {
    $('#edit-menu-title').text('Add note');
    $('.edit-dialog').data('mode', 'add')
    toggleEditMask('show');
  });

  // cancel edit mask
  $('.js-button-item-cancel').on('click', function() {
    toggleEditMask('hide');
  });

  // save new/edited item
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

  // delete an item
  $('.js-button-delete-item').on('click', function() {
    if(window.confirm('Delete this note?')) {
      var index = $('.edit-dialog').data('index');
      var _id = $('#edit-id').val();
      TheNoteList.deleteItem(index, _id);
      toggleEditMask('hide');
    }
  });

  // today button
  $('.js-btn-duedate-today').on('click', function() {
    $('#edit-duedate').val(getToday());
  });

  // tomorrow button
  $('.js-btn-duedate-tomorrow').on('click', function() {
    $('#edit-duedate').val(getTomorrow());
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

  // menu toggle
  $('.js-menu-toggle').on('click', function() {
    $('.app-toolbar').toggleClass('app-toolbar--hidden');
  });

  // style toggle
  $('.js-style-toggle').on('click', function() {
    $('body').toggleClass(THEME_CLASS_NAME);
    var cval = $('body').hasClass(THEME_CLASS_NAME) ? THEME_CLASS_NAME : 'default';
    setCookie(THEME_COOKIE_NAME, cval, 30);
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
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      initDescriptionMoreLinks();
    }, 200);
  });

});
