Template.initiativesUpdate.helpers({
  newInitiatives: function(){
    return Initiatives.find({
      createdAt: {$gt: Session.get('lastUpdated')}, 
      active: {"$exists": true},
      active: true
    }).count();
  }
})

Template.initiativesUpdate.events({
  'click .update': function(){
    Session.set('lastUpdated', Date.now());
  }
})