Meteor.startup(function() {
  Meteor.methods({
    
    markNotificationsAsRead: function(notificationIds){
      _.each(notificationIds, function(notificationId) {
        check(notificationId, String);
      });

      if(Meteor.user()){
        Notifications.update({_id: {$in: notificationIds}}, {$set: {isRead: true}}, {multi: true});
      }
    }
  });
});