$(function() {
  'use strict';

  var TheNoteList = new NoteList();
  var noteItemTemlpate = $('#node_item_template').html();
  var noteItems = Handlebars.compile(noteItemTemlpate);

  $('.note_list').append(noteItems(TheNoteList.getItems()));


  $('.note_item__edit_toggle').on('click', function () {
    $('.edit-dialog').toggleClass('edit-dialog-open');
  });

  $('.style-toggle').on('click', function () {
    $('body').toggleClass('style-change');
  });

  $('.menu-toggle').on('click', function () {
    $('.filter-dialog').toggleClass('filter-dialog-open');
  });

  $('.btn-action-primary').on('click', function(){
    //save the form
  });

});


function NoteList() {

  const STORAGE_KEY = 'note-items';

  var self = this;
  var items = [];

  self.getItems = function(){
    return self.items;
  }

  self.addItem  = function(item) {
    self.items.push(item);
  }

  function storeTestData() {
    console.log('store test data');
    self.items = [
      {
        id: 1,
        status: 0,
        title: 'Website erstellen',
        description: 'Dies ist ein Typoblindtext. An ihm kann man sehen, ob alle Buchstaben da sind und wie sie aussehen.',
        priority: 5,
        duedate: '2016-08-01'
      },
      {
        id: 2,
        status: 1,
        title: 'Blumentopf kaufen',
        description: 'Manchmal benutzt man Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.',
        priority: 3,
        duedate: '2016-07-11'
      },
      {
        id: 3,
        status: 1,
        title: 'Eine schlaue Aufgabe ausdenken und diese dann als Notiz hier erfassen',
        description: 'Manchmal benutzt man Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.',
        priority: 4,
        duedate: '2016-05-31'
      }
    ];
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
    if (!hasStorage()){
      alert('No local storage available.');
      return;
    }
    else if (localStorage.getItem(STORAGE_KEY)) {
      self.items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
  }

  function storeItems() {
    if (!hasStorage()){
      alert('No local storage available.');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(self.items));
  }

  //storeTestData();
  loadItems();

}
