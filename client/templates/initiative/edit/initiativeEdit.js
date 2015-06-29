Template.initiativeEdit.helpers({
  getCategories: function(){
    return Initiatives.InitiativeCategories;
  },
  getSelected: function(category){
    return this.category == category ? 'selected' : '';
  }
});

Template.initiativeEdit.events({
  'submit form': function(e, tpl){
    e.preventDefault();
    updateInitiative(this, tpl);
  },
  'click .edit-title, click .close, click .save': function(e, tpl){
    Session.set('editing', null);
  }
});

Template.initiativeEdit.onRendered(function(){
  $(window).on('resize', function(){
    Session.set('editing', null);
  })
});

Template.initiativeEditFull.helpers({
  getCategories: function(){
    console.log(Initiatives.InitiativeCategories);
    return Initiatives.InitiativeCategories;
  },
  getSelected: function(category, compare){
    console.log(category, compare);
    return category === compare ? 'selected' : '';
  }
});

Template.initiativeEditFull.events({
  'submit form': function(e, tpl){
    e.preventDefault();
    updateInitiative(this, tpl);
  }
});


function updateInitiative(initiative, tpl){
  
  var title = tpl.find('#title').value,
  description = tpl.find('#description').value,
  category = tpl.find('#category');
  if(!category)
    category = initiative.category;

  if(title && description){
    var props = {
      title: title,
      description: description,
      category: category
    };

    Meteor.call('updateInitiative', initiative, props, function (err, result) {
      if(err){
        sAlert.error(err.message);
      } else {
        Session.set('editing', null);
        Router.go('initiatives.mine');
      }
    });
  }
}