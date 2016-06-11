$(function() {
  'use strict';

  Handlebars.registerHelper('formattedDate', function(data) {
    var date = new Date(data);
    return getFormattedDate(date);
  });

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


  function NoteList() {

    const STORAGE_KEY = 'note-items';

    var self = this;
    self.items = [];

    self.getItems = function(){
      return self.items;
    };

    self.getItem = function(index){
      return self.items[index];
    };

    self.addItem = function(item) {
      self.items.push(item);
      storeItems();
    };

    self.replaceItem = function(index, item) {
      self.items.splice(index, 1, item);
      storeItems();
    };

    self.deleteItem = function(index) {
      self.items.splice(index, 1);
      storeItems();
    };

    self.sortItems = function(field, order) {
      switch(field) {
        case 'duedate':
          self.items.sort(sortByDueDate);
          break;
        case 'priority':
          self.items.sort(sortByPriority);
          break;
        case 'createdate':
          self.items.sort(sortByCreateDate);
      }
      console.log(order);
      if (order == 'desc') {
        self.items.reverse();
      }
      storeItems();
    }

    function storeTestData() {
      self.addItem(new Note('Website erstellen', 'Dies ist ein Typoblindtext. An ihm kann man sehen, ob alle Buchstaben da sind und wie sie aussehen.', 3, '2016-07-15'));
      self.addItem(new Note('Blumentopf kaufen', 'Manchmal benutzt man Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.', 4, '2016-07-16'));
      self.addItem(new Note('Aufgabenliste programmieren', 'Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.', 5, '2016-07-17'));
      storeItems();
    };

    function hasStorage() {
      try {
        localStorage.setItem('test-storage', 'test');
        localStorage.removeItem('test-storage');
        return true;
      }
      catch (exception) {
        return false;
      }
    };

    function loadItems() {
      if (!hasStorage()){
        alert('No local storage available.');
        return;
      }
      else if (localStorage.getItem(STORAGE_KEY)) {
        self.items = JSON.parse(localStorage.getItem(STORAGE_KEY));
        refreshList();
      }
    };

    function storeItems() {
      if (!hasStorage()){
        alert('No local storage available.');
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(self.items));
      refreshList();
    };

    function refreshList() {
      var source = $('#node_item_template').html();
      var template = Handlebars.compile(source);
      $('.note_list').html(template(self.getItems()));
    };

    function sortByCreateDate(a, b) {
      return parseInt(a.createdate) - parseInt(b.createdate);
    }

    function sortByDueDate(a, b) {
      return parseInt(a.duedate) - parseInt(b.duedate);
    }

    function sortByPriority(a, b) {
      return parseInt(a.priority) - parseInt(b.priority);
    }

    //storeTestData();
    loadItems();
  }

  function Note(title, description, priority, duedate, isDone) {
    var self = this;
    self.title = title;
    self.description = description;
    self.priority = priority;
    self.duedate = duedate;
    self.isDone = (typeof isDone != 'undefined') ? isDone : false;
    self.createdate = new Date(Date.now());
    self.finisheddate = null;
  }


  var TheNoteList = new NoteList();

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
    var item = new Note(
      $('#edit-title').val(),
      $('#edit-description').val(),
      $('input[name="edit-priority"]:checked').val(),
      Date.parse($('#edit-duedate').val())
    );

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
      TheNoteList.deleteItem(index);
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
  });
  $('#js-sort-by-createdate').on('click', function() {
    $(this).toggleClass('desc');
    var order = $(this).hasClass('desc') ? 'desc' : 'asc';
    TheNoteList.sortItems('createdate', order);
  });
  $('#js-sort-by-priority').on('click', function() {
    $(this).toggleClass('desc');
    var order = $(this).hasClass('desc') ? 'desc' : 'asc';
    TheNoteList.sortItems('priority', order);
  });

  // edit item
  $('.note_list').on('click', '.js-button-edit-item',  function () {
    var index = $(this).data('id');
    var item = TheNoteList.getItem(index);
    $('#edit-title').val(item.title);
    $('#edit-description').val(item.description);
    $('input[name="edit-priority"][value="'+item.priority+'"]').prop('checked', true);
    $('#edit-duedate').val(getFormattedDate(new Date(item.duedate)));

    $('#edit-menu-title').text('Edit note');
    toggleEditMask('show');
    $('.edit-dialog').data('mode', 'edit').data('index', index);
  });

  // style toggle
  $('.style-toggle').on('click', function() {
    $('body').toggleClass('style-change');
  });

  // menu toggle
  $('.menu-toggle').on('click', function() {
    $('.filter-dialog').toggleClass('filter-dialog-open');
  });

  // handle item checkbox
  $('.note_list').on('click', '.js-item-flag-done', function() {
    var item = TheNoteList.getItem($(this).data('id'));
    if($(this).prop('checked')) {
      item.isDone = true;
      item.finisheddate = new Date().now();
    }
    else {
      item.isDone = false;
      item.finisheddate = null;
    }
    TheNoteList.replaceItem($(this).data('id'), item);
  });

});
