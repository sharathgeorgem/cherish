Template.initiativeCard.helpers({
  isMine: function(){
    return this.createdBy === Meteor.userId();
  },
  showStatus: function(){
    return Router.current().route.path(this).match('/profile/');
  },
  status: function(){
    return this.active ? 'Active': 'Inactive';
  },
  getEditingClass: function(){
    return Session.get('editing') === this._id ? 'open' : '';
  }
});

Template.initiativeCard.events({
  'click .votes': function(e, tpl){
    // TODO: restrict votes to 1 pr initiative
    var initiative = this;
    addOrRemoveVote(initiative); 

  },
  'dblclick .touch .card-image a': function(e, tpl){
    console.log('double click initiative');
    e.preventDefault();
    var initiative = this;
    addOrRemoveVote(initiative); 
  },
  'click .status': function(e, tpl){
    Meteor.call('setInactiveActive', this, function(err, res){
      if(err){
        sAlert.error(err.message);
      } else {
        sAlert.info('initiative updated');
      }
    });
  },
  'click .edit-initiative': function(e, tpl){
    Session.set('editing', this._id);
  }
});