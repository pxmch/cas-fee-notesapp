'use strict';

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
      url: SERVER+'/new',
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
      url: SERVER+'/update/'+item._id,
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
      url: SERVER+'/delete/'+id,
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
