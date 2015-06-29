Initiatives = new Mongo.Collection('initiatives');

Initiatives.helpers({
  getInitiativeCategory: function() {
    return this.category.toLowerCase();
  },
  getInitiativeImage: function() {
    return this.imageUrl;
  },
  getInitiativeAuthorImage: function() {
    var user = Users.findOne(this.createdBy);
    if(user) {
      return user.profile.avatarImg;
    } else {
      return '/images/placeholder-avatar.jpg';
    }
  }
});

if(Meteor.isServer) {
  Initiatives._ensureIndex({title: 1, category: 1});
}

Initiatives.InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];
Initiatives.InititaiveCategorySlugs = Initiatives.InitiativeCategories.map(function(category) {
  return {
    slug: s.slugify(category),
    category: category
  };
});

// create slugs
var initiativeSlugs = function(userId, doc) {
  doc.slug = s.slugify(doc.title);
  doc.categorySlug = s.slugify(doc.category);
};

Initiatives.before.insert(initiativeSlugs);

Initiatives.before.insert(function(userId, doc){
  doc.createdAt = Date.now()
});

Initiatives.before.update(function(userId, doc, fieldNames, modifier){
    if(!_.isEmpty(modifier.$set)){
      modifier.$set.modifiedAt = Date.now();
    }
});

Initiatives.after.update(function(userId, doc, fieldNames, modifier, options){
  function createNotification(type, user, owner){
    Notifications.insert({
      initiativeId: doc._id,
      userId: user,
      ownerId: owner,
      type: type,
      createdAt: new Date().getTime(),
      isRead: false
    })
  }

  function sendFollowersNotification(type, userId){
    if(doc.usersFollowing && doc.usersFollowing.length > 0){
      _.each(doc.usersFollowing, function(user){
        if(user !== userId)
          createNotification(type, userId, user);
      });
    }
  }

  // Only send notifications on others initiatives
  
    if(modifier.$addToSet && modifier.$addToSet.comments){
      if(doc.createdBy !== userId)
        createNotification('comment', userId, doc.createdBy);
      sendFollowersNotification('comment', userId);
    }

    if(modifier.$addToSet && modifier.$addToSet.usersVoted){
      createNotification('vote', userId, doc.createdBy);
      sendFollowersNotification('vote', userId);
    }

    if(modifier.$pull && modifier.$pull.usersVoted){
      createNotification('remove-vote', userId, doc.createdBy);
    }
    
    if(modifier.$addToSet && modifier.$addToSet.usersFollowing){
      createNotification('follow', userId, doc.createdBy);
      sendFollowersNotification('follow', userId);
    }
    if(modifier.$pull && modifier.$pull.usersFollowing){
      createNotification('unfollow', userId, doc.createdBy);
      sendFollowersNotification('unfollow', userId);
    }
  // }


});