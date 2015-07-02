Template.initiativeCreate.onRendered(function() {
  $('select').material_select();
});

Template.initiativeCreate.helpers({
  overLimit: function(){
    var initiativeCount = Initiatives.find({
      createdBy: Meteor.userId(), 
      active: {
        "$exists": true
      },
      active: true
    }).count();
    return initiativeCount >= 1;
  }
})

Template.initiativeCreate.events({
  'submit .form-create': function (event, template) {
    event.preventDefault();

    var title = template.find('input[name=name]').value || undefined,
        description = template.find('input[name=description]').value || undefined,
        category = template.find('select').value || undefined;
    

    if(!title) {
      sAlert.error('You must enter a name for your Initiative.');
    }
    if(!description) {
      sAlert.error('You must enter a description for your Initiative.');
    }
    if(!category) {
      sAlert.error('You must select a category for your Initiative.');
    }

    if(!title || !description || !category) {
      return;
    }

    Meteor.call('createInitiative', title, description, category, function(err, response) {
      if(err) {
        if(err.error ==  403) {
          sAlert.error(err.reason);
        } else {
          console.log(err);
        }
      } else {
        sAlert.success('Congratulations! Your Initiative has been created.');
        Router.go('initiative', {slug: response});
      }
    });
  },

  'click input[type=checkbox]': function(event, template) {
    $('.checkboxes').find('input[type=checkbox]:checked').each(function() {
      if($(this).val() == event.target.value) {
        $(this).attr('checked', true);
      } else {
        $(this).attr('checked', false);
      }
    });
  }
});