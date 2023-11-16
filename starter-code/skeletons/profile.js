"use-strict"
// do something with the url, so #ed
// so just add on to it
// get the has property

function load_profile(username) {
    
    username = username.substring(1).toLowerCase();
    const parser = new DOMParser();

    const photobox = document.querySelector("#img");
    const nameBox = document.querySelector("#name");
    const usernameBox = document.querySelector("#username");
    const descriptionBox = document.querySelector("#description");
    const photo = document.createElement("img");
    const following = document.querySelector("#following");
    const followers = document.querySelector("#followers");
    const calendar = document.querySelector("#created");
    const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];


    // fetch the user info for the top of the page
    fetch("/api/user/get/" + `${username}` + ".json").then(data => data.json()).then(resp => {
        // set photo properties
        photo.src = resp.profile_image_url;
        photo.alt = "profile photo";
        photo.classList = "img-fluid border rounded p-2";
        // add proper info into respective boxes
        photobox.appendChild(photo);
        nameBox.appendChild(document.createTextNode(`${resp.name}`));
        usernameBox.appendChild(document.createTextNode(`${resp.screen_name}`));
        if (resp.description === null) resp.description = " ";
        descriptionBox.appendChild(document.createTextNode(`${resp.description}`));
        // get the relevant info out of the joined date string
        let joined = resp.created.split("-");
        calendar.appendChild(document.createTextNode(" Joined " + `${months[joined[1] - 1]}` + " " + `${joined[0]}`));
        // add followers and following
        followers.appendChild(document.createTextNode(`${resp.followers_count}` + " followers"));
        following.appendChild(document.createTextNode(`${resp.friends_count}` + " following"));
        // edit profile if you are the logged in user
        if (username === "kevinaangstadt"){
            document.querySelector("#profile-info").appendChild(parser.parseFromString(`
                <button type="button" class="btn btn-light"><i class="bi bi-pencil"></i> Edit Profile</button>
            `, "text/html").body.firstElementChild);
        }
    });

    // fetch for favorites tab
    fetch("/api/favorites/" + `${username}` + ".json").then((r) => r.json())
    .then(async (data) => {
        const replyPromises = Object.values(data).map(async (s) => {
          let replything = ``;
  
          if ("in_reply_to_status_id_str" in s) {
            let statusid = s["in_reply_to_status_id_str"];
            const pathtoname = await (await fetch(`/api/statuses/show/${statusid}.json`)).json();
            const name = pathtoname["user"]["name"];
            console.log(name);
            replything = `
              <div class="container text-start col-md-10 mt-2">
                <i class="bi bi-chat-right-fill" style="color: grey"></i>
                <a style="color: grey"><strong>${s["user"]["name"]} replied to ${name}</strong></a>
              </div>`;
          } else {
            replything = ``;
          }
  
          // Return the replything from the map function
          return replything;
        });

        const replyThings = await Promise.all(replyPromises);

        Object.values(data).forEach((s, index) => {
        if (Object.values(data).length === 0){ // if there are no replies or slimes
            let text = parser.parseFromString(`
                <h2 class="text-center text-muted pt-4">
                    <strong>${username} has no slimes or replies</strong>
                </h2>
            `, "text/html");
            document.querySelector("#favorites").appendChild(text.body.firstElementChild);
        }
        else {
            createSlime(s, document.querySelector("#favorites"), replyThings[index]);
            
        }
    });
});


    // fetch for replies and slimes tab
    fetch("/api/statuses/user_timeline/" + `${username}` + ".json").then((r) => r.json())
    .then(async (data) => {
        const replyPromises = Object.values(data).map(async (s) => {
          let replything = ``;
  
          if ("in_reply_to_status_id_str" in s) {
            let statusid = s["in_reply_to_status_id_str"];
            const pathtoname = await (await fetch(`/api/statuses/show/${statusid}.json`)).json();
            const name = pathtoname["user"]["name"];
            replything = `
              <div class="container text-start col-md-10 mt-2">
                <i class="bi bi-chat-right-fill" style="color: grey"></i>
                <a style="color: grey"><strong>${s["user"]["display_name"]} replied to ${name}</strong></a>
              </div>`;
          } else {
            replything = ``;
          }
  
          // Return the replything from the map function
          return replything;
        });

        const replyThings = await Promise.all(replyPromises);

        Object.values(data).forEach((s, index) => {
        if (Object.values(data).length === 0){ // if there are no replies or slimes
            let text = parser.parseFromString(`
                <h2 class="text-center text-muted pt-4">
                    <strong>${username} has no slimes or replies</strong>
                </h2>
            `, "text/html");
            document.querySelector("#replies").appendChild(text.body.firstElementChild);
        }
        else {
            createSlime(s, document.querySelector("#replies"), replyThings[index]);
            
        }
    });
});

    // fetch for slimes tab
    fetch("/api/statuses/user_timeline/" + `${username}` + ".json").then((r) => r.json())
    .then(async (data) => {
        const replyPromises = Object.values(data).map(async (s) => {
          let replything = ``;
  
          if ("in_reply_to_status_id_str" in s) {
            let statusid = s["in_reply_to_status_id_str"];
            const pathtoname = await (await fetch(`/api/statuses/show/${statusid}.json`)).json();
            const name = pathtoname["user"]["name"];
            replything = `
              <div class="container text-start col-md-10 mt-2">
                <i class="bi bi-chat-right-fill" style="color: grey"></i>
                <a style="color: grey"><strong>${s["user"]["display_name"]} replied to ${name}</strong></a>
              </div>`;
          } else {
            replything = ``;
          }
  
          // Return the replything from the map function
          return replything;
        });

        const replyThings = await Promise.all(replyPromises);

        Object.values(data).forEach((s, index) => {
        if (Object.values(data).length === 0){ // if there are no slimes
            let text = parser.parseFromString(`
                <h2 class="text-center text-muted pt-4">
                    <strong>${username} has no slimes</strong>
                </h2>
            `, "text/html");
            document.querySelector("#slimes").appendChild(text.body.firstElementChild);
        }
        else {
            // filter out replies
            if (s.in_reply_to_user_id_str === undefined){
                createSlime(s, document.querySelector("#slimes"), replyThings[index]);
            }
        }
    });
});

    async function createSlime(s, slimes, replything) {
        let head = "";
        let is_reslime = "";
        let reslime_name;

        // check if this is a reslime
        if (s.reslimed_status_id_str != undefined) {
            is_reslime = "reslime";
            reslime_name  = s.user.name
            s = s.reslimed_status;   
        }

        // fucntions to return correct color for icons and corresponding text
        function favorited() {
            if (s.favorite_count > 0) {
                return ["red", "bi-heart-fill"];
            } 
            return ["black", "bi-heart"];
        };
        function reslimed(){
            if (s.reslime_count > 0) {
                return "green";
            } 
            return "black";
        };
    
        // return the date in the month_day format to add after the screen name in the slime
        function getDate() {
            // split the created at string at ever space
            const string = s.created_at.split(' ');
            const date = `${string[2]} ${string[1]}`;
            return date;
        };
    
                // go through ents, if they exist, find and replace with correct html
                function getText(text, ents) {
                    let words = text.split(' ');
                    // loop through ents
                    for (const key in ents) {
                        if(ents[key].length > 0) {
                            for(const el in ents[key]){
                                let ent = ents[key][el];
                                if (ent.length > 0) {
                                    // replace with html
                                    // grab the word that needs to be replaced
                                    let word = ent[0];
                                    switch (word) {
                                        case "#":
                                            // I changed Lisa's mention in entities in # so it matches the text
                                            words[words.indexOf(ent)] = `
                                                <span class="blue-text"><a href="#">${ent}</a></span>
                                                `;
                                            break;
                                        case "@":
                                            words[words.indexOf(ent)] = `
                                            <span class="blue-text"><a href="profile.html?username=${ent}">${ent}</a></span>
                                            `;
                                            break;
                                    }; // switch
                                } 
                            }  
                        }
                    }
                    return words.join(" ");
                };
        
        let slime = parser.parseFromString(`
            <div class="container p-2">
                <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
                    <div class="row" id="row">

                    <div class="row">
                        ${replything}
                    </div>

                        <div class="col-md-2 pb-4 pt-4 ps-3 thumbnail-container p-2">
                            <img src="${s["user"]["profile_image_url"]}" class="img-thumbnail" alt="Profile Image">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <h6 class="card-title text-bold"><a href="profile.html?username=${s["user"]["screen_name"]}"
                                    style="text-decoration: none; color: black;">${s["user"]["name"]}</a><small class="text-muted"> ${s["user"]["screen_name"]} ·
                                    ${getDate()}</small></h6>
                                    <p class="card-text">${getText(s.text, s.entities)}</p>
                                <div class="row">
                                    <div class="col-md-3" style="list-style: none">
                                        <small class="text-muted">
                                        <i class="bi bi-chat-right" style="color: gray"></i>
                                        <span style="color: gray">${s["reply_count"]}</span>
                                        </small>
                                    </div>
                                    <div class="col-md-3" style="list-style: none">
                                        <small class="text-muted">
                                        <i class="bi bi-recycle" style="color:${reslimed()}"></i>
                                        <span style="color: ${reslimed()}">${s["reslime_count"]}</span>
                                        </small>
                                    </div>
                                    <div class="col-md-3" style="list-style: none">
                                        <small class="text-muted">
                                        <i class="bi ${favorited()[1]}" style="color:${favorited()[0]}"></i>
                                        <span style="color: ${favorited()[0]}">${s["favorite_count"]}</span>
                                        </small>
                                    </div>
                                    <div class="col-md-3" style="list-style: none;">
                                        <small class="text-muted">
                                        <i class="bi bi-upload"></i>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `, "text/html");

        if (is_reslime === "reslime"){
            let head = parser.parseFromString(`
                <p class="container text-start col-md-10 mt-2 mb-0">
                    <i class="bi bi-recycle" style="color: grey"></i>
                    
                    <a style="color: grey"><strong>${reslime_name} reslimed</strong></a>
                </p>
                `, "text/html");
            let row = slime.querySelector("#row")
            row.prepend(head.body.firstElementChild);
        }
        
        slimes.appendChild(slime.body.firstElementChild);
    }

}

window.addEventListener("load", () => {
    // Extract username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    // check if the username is availabl
    if (username) {
        load_profile(username);
    } else {
        console.error("Username not provided in the URL.");
    }
});