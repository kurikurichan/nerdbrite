Check out a live version of nerdbrite here: [Nerdbrite Live](https://nerdbrite.herokuapp.com/)

Nerdbrite is a full-stack clone of the popular website eventbrite, which is used for booking tickets for events (both free and paid). It was built using Reactjs, Redux, Node.js, PostgreSQL, and Sequelize.

## Welcome View:
![Screen Shot 2022-07-05 at 12 21 39 AM](https://user-images.githubusercontent.com/8907997/177274368-a419cb23-1980-4980-bdaf-bebf7bd2a7e1.png)

## Events View:
![Screen Shot 2022-07-05 at 12 23 04 AM](https://user-images.githubusercontent.com/8907997/177274571-4d78f56c-1217-45cc-ae84-28b96bea950e.png)

## React Store Shape:
```javascript
var store = {
    session: {},
    events: {
        eventId: {
            eventData,
            user: (userData of host),
            categoryType: "category string",
            venueId
        },
        optionalOrderedList: []
    },
    tickets: {
        ticketId: {
            ticketData,
            event: { eventData for this event },
            user: {userData of who booked ticket},
            Venue: {Venue name},
            Category: {Category name/type}
        },
        optionalOrderedList: []
    }
}
```


Project Name: | Nerdbrite
-- | --
Clone: | Eventbrite
Feature List: | https://github.com/kurikurichan/nerdbrite/wiki/Features-List
DB Schema Diagram: | https://github.com/kurikurichan/nerdbrite/wiki/Database-Schema
Github: | https://github.com/kurikurichan/nerdbrite
Scorecard: | https://docs.google.com/spreadsheets/d/1CKUy9Au3vrC6sLrUGJKOGoei6IOAjEbrLECsNcJ6Jbs/edit?usp=sharing
Live Link: | https://nerdbrite.herokuapp.com/


## Future Features
* Search function
* "Manage my Events" page
* Google Maps API
* Add/Edit Venues
