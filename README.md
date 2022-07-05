# nerdbrite

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
## Challenges of This Project

There were many challenges but two in particular stand out to me...

1.) Getting the event edit form to maintain its data even upon refresh. I tried all sorts of conditional rendering, until finally I found the solution - putting it all in an if statement in a useEffect block, rather than having conditionals on each one.

2.) Dealing with the Javascript date issues between my local machine and Heroku. I first realized that whenever I edited an event, it would cause the day to go back by one with each edit. I fixed this on my local machine by using Date.getTime() and getTimeZoneOffset(). This worked until it was on Heroku, since it turns out that Heroku uses UTC time. I ended up implementing a helper function in the API routes to convert the dates to a proper format before sending them off into the database: 

```javascript
function fixDate(date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
}
```
In addition to also in the front end fixing the fact that the dates were rendering incorrectly due to timezones: 
```javascript
new Date(event.date).toLocaleString('en-CA', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" })
```
I also realized the importance in React of reusing components to simplify coding. I did a separate form for creating events and editing events, which ended up taking extra time to debug - in the future I would make a separate form component and then render it in the necessary areas, and drive down the necessary states into the forms via props. 

Project Name: | Nerdbrite
-- | --
Clone: | Eventbrite
Feature List: | https://github.com/kurikurichan/nerdbrite/wiki/Features-List
DB Schema Diagram: | https://github.com/kurikurichan/nerdbrite/wiki/Database-Schema
Github: | https://github.com/kurikurichan/nerdbrite
Scorecard: | https://docs.google.com/spreadsheets/d/1uyIKckEQB1SsAg2inK3vy2-8_Dv5uNtkxiEi-7ZmnMU/edit#gid=1712141062
Live Link: | https://nerdbrite.herokuapp.com/

## Installation instructions
* clone this repository from Github
* npm install all dependencies
* install postgreSQL
* create a user with CREATEDB privileges, and a database
* create a .env file, insert that information
* run the migrations & seeder data
* npm start on frontend and backend to run program
* enjoy!


## Future Features
* Search function
* "Manage my Events" page
* Google Maps API
* Add/Edit Venues
