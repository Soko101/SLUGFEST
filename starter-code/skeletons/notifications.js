"use strict" 
// function that takes slime data and generates card from them
/**
 * Create a Slime DOM and return it
 * @param slimeData {object} all of the data needed to create a slime
 * @return a DOM Element object for the slime
 */

window.addEventListener("load", () => {
    fetch("/api/statuses/activity.json").then((r) => r.json()).then((data) => {
        Object.values(data).forEach((s) =>{
            if("reslimed_status" in s){
                s.text = s["reslimed_status"]["text"];
                s.entities = s["reslimed_status"]["entities"];
                s.reply_count = s["reslimed_status"]["reply_count"];
                s.reslime_count = s["reslimed_status"]["reslime_count"];
                s.favorite_count = s["reslimed_status"]["favorite_count"];
                //s["user"]["screen_name"] = s["reslimed_status"]["user"]["screen_name"];
                createSlime(s);
            } else {
                createSlime(s);
            }
        })
    })
})

async function createSlime(s) {

    // NOTES
    // all dates are the same

    // return the profile picture of the slime poster
    function getPicture(){
            return s["user"]["profile_image_url"];
    }

    // return the full name of the person posting
    function getDisplayName(){
        return s["user"]["display_name"];
    }

    // if it's a reslime, it return the little text and icon saying that
    // otherwise, it returns nothing
    function getReslimeIcon(){
        if(s["reslimed"]){
            return `
            <svg xmlns="http://www.w3.org/2000/svg" class="rounded float-start; bi bi-recycle" width="50" height="50" 
            fill="green" viewBox="0 0 16 16" style="padding-top: 15px">
                <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z"/>
            </svg>`;
        } else {
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#0dcaf0" class="bi bi-chat-left-fill" 
            viewBox="0 0 16 16" style="padding-top: 15px">
                <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            </svg>`;
        }
    }

    // function to get the text next to the name depending on if it is a reslime or a reply
    function getReslimed() {
        if("reslimed_status_id_str" in s){
            return `
            reslimed you`;
        } else {
            return `
            replied to you`;
        }
    }

    // Get the user's description
    function getAltText() {
        return s["user"]["description"];
    }
    
    // go through ents, if they exist, find and replace with correct html
    function getText(text, ents) {
        let words = text.split(' ');
        console.log(words);
        // loop through ents
        for (const key in ents) {
            console.log("h: ", ents[key]);
            if(ents[key].length > 0) {
                for(const el in ents[key]){
                    let ent = ents[key][el];
                    console.log("ent: ", ent);
                    if (ent.length > 0) {
                        // replace with html
                        // grab the word that needs to be replaced
                        let word = ent[0];
                        switch (word) {
                            case "#":
                                // I changed Lisa's mention in entities in # so it matches the text
                                words[words.indexOf(ent)] = `
                                    <span class="blue-text"><a href="#">${ent}</a></span>`;
                                    break;
                            case "@":
                                words[words.indexOf(ent)] = `
                                    <span class="blue-text"><a href="profile.html?username=${ent}">${ent}</a></span>`;
                                    break;
                            }; // switch
                        } 
                    }  
                }
            }
            return words.join(" ");
        };

    const slimes = document.querySelector("#slimes");
    const parser = new DOMParser();

    // produce the slime
    const slime = parser.parseFromString(`
    <div class="container">
        <div class="col-md-3"></div>
            <div class="card.invisible mb-3 mt-2 mx-auto border-bottom" style="max-width: 700px;">
                <div class="container">
                    <div class="row g-3">
                        <div class="col-md-1">
                            ${getReslimeIcon()}
                        </div>
                    <div class="col-md-5">
                        <div class="card-body mb-2">
                            <img src=${getPicture()} class="rounded img-fluid img-thumbnail"
                            alt=${getAltText()} style="max-width: 25%">
                            <p class="card-text mb-2"><strong><a href="profile.html?username=${s["user"]["screen_name"]}"
                            style="text-decoration: none; color: black;">${getDisplayName()}</a></strong> ${getReslimed()}</p>
                            <p class="card-text"><small class="text-body-secondary">${getText(s.text, s.entities)} </small></p>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    </div>
    `, "text/html");
    
    slimes.appendChild(slime.body.firstElementChild);
}