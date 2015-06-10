if(Meteor.isServer) {
  Meteor.startup(function() {
    if(Initiatives.find().count() === 0) {
      var mockData = [
          {title: 'Initiative 1', description: 'Some arbitrary description goes here.', votes: 20},
          {title: 'Initiative 2', description: 'Some arbitrary description goes here.', votes: 5},
          {title: 'Initiative 3', description: 'Some arbitrary description goes here.', votes: 100},
          {title: 'Initiative 4', description: 'Some arbitrary description goes here.', votes: 10},
          {title: 'Initiative 5', description: 'Some arbitrary description goes here.', votes: 15},
        ];

      mockData.forEach(function(item) {
        console.log("Inserting " + item.title);
        Initiatives.insert(item);
      });
    }

    if(Meteor.users.find().count() === 0) {
      console.log('Add first test user');
      Accounts.createUser({
        username: 'cherishuser',
        password: 'password',
        email: 'admin@cherish.com',
        profile: {
          name: 'Test User'
        }
      });
    }
  });

  // TODO: Implement this when we have pub/sub going.
  //Meteor.publish('initiatives');
}