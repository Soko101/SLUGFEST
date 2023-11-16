# SLUGFEST

Recreating my Professor's remake of Twitter or X as it is now called.

This was a collaborative and hence each page was created by a different student, however I worked on the feed page and slimetrail.

Below is just a summary/architecure of the feed page as an example:

feedpage.js:

Event Listener:

1. The code begins with an event listener for the "load" event, indicating that the script will execute once the page has loaded.
   
Fetch Data:

2. The script fetches slime data from "/api/statuses/home_timeline.json" using the Fetch API.
Processing Slime Data:

3. The fetched data is processed, and for each slime, additional information is obtained if it is a reply or a reslime. 
This information is used to create a DOM element for the slime.

Asynchronous Operations:

4. There are asynchronous operations using async/await and Promise.all to handle fetching additional data (like in_reply_to_status_id_str).
   
DOM Manipulation:

5. Slime information is used to create DOM elements dynamically, and these elements are added to the page.
   
Profile Picture Addition:

6. The addPhoto function is called to add a profile picture to the page.

Slime Creation:
7. The createSlime function is responsible for generating the HTML structure for each slime and appending it to the page.

