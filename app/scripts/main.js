$(function() {
  'use strict';

  var TheNoteList = new NoteList();

  $('.js-button-add-item').on('click', function () {
    $('.edit-dialog').addClass('edit-dialog-open').data('mode', 'add');
  });

  $('.js-button-item-cancel').on('click', function () {
    $('.edit-dialog').removeClass('edit-dialog-open').data('mode', '').data('index', '');
    $('#edit-mask')[0].reset();
  });

  $('.js-btn-item-save').on('click', function () {
    var item = new Note(
      $('#edit-title').val(),
      $('#edit-description').val(),
      $('input[name="edit-priority"]:checked').val(),
      $('#edit-duedate').val()
    );

    if($('.edit-dialog').data('mode') == 'edit') {
      var index = $('.edit-dialog').data('index');
      TheNoteList.replaceItem(index, item);
    } else {
      TheNoteList.addItem(item);
    }

    $('.edit-dialog').removeClass('edit-dialog-open').data('mode', '').data('index', '');
    $('#edit-mask')[0].reset();
  });

  $('.js-btn-duedate-today').on('click', function () {
      var d = new Date();
      var month = (d.getMonth() + 1);
      var day = d.getDate();

      if(month < 10) {
        month = "0" + month;
      }
      if(day < 10) {
        day = "0" + day;
      }

      var today = d.getFullYear() + '-' + month + '-' + day;
      $('#edit-duedate').val(today);
  });

  $('.js-btn-duedate-tomorrow').on('click', function () {
    var d = new Date(Date.now()+24*60*60*1000);
    var month = (d.getMonth() + 1);
    var day = d.getDate();

    if(month < 10) {
      month = "0" + month;
    }
    if(day < 10) {
      day = "0" + day;
    }

    var tomorrow = d.getFullYear() + '-' + month + '-' + day;
    $('#edit-duedate').val(tomorrow);
  });


  $('.style-toggle').on('click', function () {
    $('body').toggleClass('style-change');
  });

  $('.menu-toggle').on('click', function () {
    $('.filter-dialog').toggleClass('filter-dialog-open');
  });

  function initEditButtons () {
    $('.js-button-edit-item').on('click', function () {
      var index = $(this).data('id');
      var item = TheNoteList.getItem(index);
      $('#edit-title').val(item.title);
      $('#edit-description').val(item.title);
      $('input[name="edit-priority"][value="'+item.priority+'"]').prop('checked', true);
      $('#edit-duedate').val(item.duedate);
      $('.edit-dialog').addClass('edit-dialog-open').data('mode', 'edit').data('index', index);
    });
  }

  initEditButtons();

});

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

  self.addItem  = function(item) {
    self.items.push(item);
    storeItems();
    refreshList();
  };

  self.replaceItem  = function(index, item) {
    self.items.splice(index, 1, item);
    storeItems();
    refreshList();
  };

  self.deleteItem  = function(index) {
    self.items.splice(index, 1);
    storeItems();
    refreshList();
  };

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
  };

  function refreshList() {
    var source = $('#node_item_template').html();
    var template = Handlebars.compile(source);
    $('.note_list').html(template(self.getItems()));
    //initEditButtons();
  };

  //storeTestData();
  loadItems();
}

function Note(title, description, priority, duedate) {
  var self = this;
  self.title = title;
  self.description = description;
  self.status = 0;
  self.priority = priority;
  self.duedate = duedate;
  self.lastmodified = Date.now();
}
