"use strict" 
// function that takes slime data and generates card from them
/**
 * Create a Slime DOM and return it
 * @param slimeData {object} all of the data needed to create a slime
 * @return a DOM Element object for the slime
 */

// window.addEventListener("load", () => {
//     // Fetch Slime Data
//     addPhoto();

//     fetch("/api/statuses/home_timeline.json").then((r) => r.json()).then((data) => {
//         Object.values(data).forEach((s) =>{
//             let replything = ``
//             Promise.all(Object.values(data).then(() => data.map( async (s) => {

//                 if("in_reply_to_status_id_str" in s){

//                     // based on the slime it is in reply to, we find the display name that it is in reply to
//                     let statusid = s["in_reply_to_status_id_str"];
//                     const pathtoname =await(await fetch(`/api/statuses/show/${statusid}.json`)).json();
//                     const name = pathtoname["user"]["name"];
//                     replything =  `
//                     <div class="container text-start col-md-10 mt-2">
//                     <i class="bi bi-chat-right-fill" style="color: grey"></i>
//                     <a style="color: grey"><strong>${s["user"]["display_name"]} replied to ${name}</strong></a>
//                 </div>
//                     `;
//                 } else {
//                     replything = ``;
//                 }
                
//             }));
            

//             if("reslimed_status" in s){
//                 s.text = s["reslimed_status"]["text"];
//                 s.entities = s["reslimed_status"]["entities"];
//                 s.reply_count = s["reslimed_status"]["reply_count"];
//                 s.reslime_count = s["reslimed_status"]["reslime_count"];
//                 s.favorite_count = s["reslimed_status"]["favorite_count"];
//                 s["user"]["screen_name"] = s["reslimed_status"]["user"]["screen_name"];
//                 createSlime(s, replything);
//             } else {
//                 createSlime(s, replything);
//             }
//         })
//     })
// })

// window.addEventListener("load", () => {
//     // Fetch Slime Data
//     addPhoto();
  
//     fetch("/api/statuses/home_timeline.json")
//       .then((r) => r.json())
//       .then(async (data) => {
//         await Promise.all(
//           Object.values(data).map(async (s) => {
//             let replything = ``;
  
//             if ("in_reply_to_status_id_str" in s) {
//               let statusid = s["in_reply_to_status_id_str"];
//               const pathtoname = await (await fetch(`/api/statuses/show/${statusid}.json`)).json();
//               const name = pathtoname["user"]["name"];
//               replything = `
//                 <div class="container text-start col-md-10 mt-2">
//                   <i class="bi bi-chat-right-fill" style="color: grey"></i>
//                   <a style="color: grey"><strong>${s["user"]["display_name"]} replied to ${name}</strong></a>
//                 </div>`;
//             } else {
//               replything = ``;
//       }})).then( () => {
//         data.array.forEach((s) => {
//             if ("reslimed_status" in s) {
//                 s.text = s["reslimed_status"]["text"];
//                 s.entities = s["reslimed_status"]["entities"];
//                 s.reply_count = s["reslimed_status"]["reply_count"];
//                 s.reslime_count = s["reslimed_status"]["reslime_count"];
//                 s.favorite_count = s["reslimed_status"]["favorite_count"];
//                 s["user"]["screen_name"] = s["reslimed_status"]["user"]["screen_name"];
//                 createSlime(s, replything);
//               } else {
//                 createSlime(s, replything);
//               }
//         });

//         }
//       )
//     });
// })

window.addEventListener("load", () => {
    // Fetch Slime Data
    addPhoto();
  
    fetch("/api/statuses/home_timeline.json")
      .then((r) => r.json())
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
  
          // return the replything from the map function
          return replything;
        });
  
        // wait for all all promises to resolve
        const replyThings = await Promise.all(replyPromises);
  
        Object.values(data).forEach((s, index) => {
          if ("reslimed_status" in s) {
            s.text = s["reslimed_status"]["text"];
            s.entities = s["reslimed_status"]["entities"];
            s.reply_count = s["reslimed_status"]["reply_count"];
            s.reslime_count = s["reslimed_status"]["reslime_count"];
            s.favorite_count = s["reslimed_status"]["favorite_count"];
            s["user"]["screen_name"] = s["reslimed_status"]["user"]["screen_name"];
  
            createSlime(s, replyThings[index]);
          } else {
            createSlime(s, replyThings[index]);
          }
        });
      });
      
  });

function addPhoto() {

    const profile = document.querySelector("#profilepicslime");
    const parser = new DOMParser();

    const picture = parser.parseFromString(`
    <figure class="p-1 border rounded">
        <img src="${"/assets/profile/kevin.jpeg"}" class="small img-fluid border rounded mr-4" alt="Kevin profile picture"> 
    </figure>
    `, "text/html");

    profile.appendChild(picture.body.firstElementChild);
}

async function createSlime(s, replything) {

    // NOTES
    // all dates are the same

    // fucntions to return correct color for icons and corresponding text

    function favorited() {
        if (s["favorited"]) {
            return "red";
        } 
        return "black";
    };
    function reslimed(){
        if (s.reslimed) {
            return "green";
        } 
        return "black";
    };
    function replies() {
        if (s["reply_count"] > 0) {
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

    // return the profile picture of the slime poster
    function getPicture(){
        if("reslimed_status" in s){
            return s["reslimed_status"]["user"]["profile_image_url"];
        } else{
            return s["user"]["profile_image_url"];
        }
    }

    // return the full name of the person posting
    function getDisplayName(){
        if("reslimed_status" in s){
            return s["reslimed_status"]["user"]["display_name"];
        } else{
            return s["user"]["display_name"];
        }
    }


    // if it's a reslime, it return the little text and icon saying that
    // otherwise, it returns nothing
    function getReslime(){
        if("reslimed_status" in s){
            return `
        <div class="container text-start col-md-10 mt-2">
            <i class="bi bi-recycle" style="color: grey"></i>
            <a style="color: grey"><strong>${s["user"]["display_name"]} reslimed</strong></a>
        </div>`;
        } else {
            return ``;
        }
    }

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

    // if the slime is liked, fill the heart
    function fav() {
        if (s.favorited) {
            return "-fill";
        } 
        return "";
    };

    const slimes = document.querySelector("#slimes");
    const parser = new DOMParser();

    // produce the slime
    const slime = parser.parseFromString(`
        <div class="container p-2">
            <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">

                <div class="row">
                    ${getReslime()}
                </div>

                <div class="row">
                    ${replything}
                </div>

                <div class="row">
                    <div class="col-md-2 pb-4 pt-4 ps-3 thumbnail-container p-2">
                        <img src="${getPicture()}" class="img-thumbnail" alt="Profile Image">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <h6 class="card-title text-bold"><a href="profile.html?username=${s["user"]["screen_name"]}"
                                style="text-decoration: none; color: black;">${getDisplayName()}</a><small class="text-muted"> ${s["user"]["screen_name"]} ·
                                ${getDate()}</small></h6>
                                <p class="card-text">${getText(s.text, s.entities)}</p>
                            <div class="row">
                                <div class="col-md-3" style="list-style: none">
                                    <small class="text-muted">
                                    <i class="bi bi-chat-right" style="color: ${replies()}"></i>
                                    <span style="color: ${replies()}">${s["reply_count"]}</span>
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
                                    <i class="bi bi-heart${fav()}" style="color:${favorited()}"></i>
                                    <span style="color: ${favorited()}">${s["favorite_count"]}</span>
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

    slimes.appendChild(slime.body.firstElementChild);
}