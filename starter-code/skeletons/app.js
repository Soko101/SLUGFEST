
document.addEventListener("DOMContentLoaded", function() {
const extractHashtagsAndText = (text) => {
  const regex = /(#\w+)|(\S+)/g;
  const matches = text.match(regex) || [];

  return matches;
};
const extractMentionAndText = (text) => {
  const regex = /(@\w+)|(\S+)/g;
  const matches = text.match(regex) || [];

  return matches;
};
    const init = async () => {
  const jsonFiles = ['/api/statuses/show/611fcaf640148d94e2a469c7.json', '/api/statuses/replies/611fcaf640148d94e2a469c7.json'];

  const appendDataToElement = async (elementId, url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const json = await response.json();
      const container = document.getElementById(elementId);
      const app = document.createElement("div");
      // Build your HTML content based on 'json' and append it to 'app'
      if (elementId == 'slime') {
        const textWithHashtags = extractHashtagsAndText(json.text);
        app.innerHTML = `<div class="box"><div class="Item mt-3">
                    <div class="d-flex top">
                        <div class="left">
                            <img src="`+json.user['profile_image_url']+ `" alt="">
                        </div>
                        <div class="right">
                            <h3><a href="profile.html?username=${json.user['screen_name']}"
                            style="text-decoration: none; color: black;">`+json.user['name']+ `<span>`+json.user['screen_name']+`</span></h3>
                        </div>
                    </div> 
                    <div class="bottom mt-3">
                        <p>${textWithHashtags.map((part) => part.startsWith('#') ? `<a href="#" class="hashtag">${part}</a>` : part).join(' ')} </p>
                         <p >`+json.created_at+ `</p>
                        <div class="links" style="padding-top: 15px;padding-bottom: 7px;border-top: 1px solid #eaeaea;border-bottom: 1px solid #eaeaea;">
                            <div class="link" style="">
                                <i class="bi bi-chat-right"></i>
                                <h5>`+json.reply_count+ `</h5>
                            </div>
                            <div class="link">
                                <i class="bi bi-recycle"></i>
                                <h5>`+json.reslime_count+ `</h5>
                            </div>
                            <div class="link favorite">
                                <i class="fa-regular fa-heart"></i>
                                <h5>`+json.favorite_count + `</h5>
                            </div>
                            <div class="link">
                                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                            </div>
                        </div>
                    </div>
                </div> </div>`;
                if (json.favorite_count > 0) {
                      app.querySelector('.favorite').classList.add('red');
                      app.querySelector('.favorite i').classList.add('fa-solid');
                    }
      }
      if (elementId == 'slimeReply') {
        json.forEach((item) => {
            const textWithMentions = extractMentionAndText(item.text);
      app.innerHTML = `<h4>Replies</h4><div class="box"><div class="Item mt-3">
                    <div class="d-flex top">
                        <div class="left">
                            <img src="`+item.user['profile_image_url']+ `" alt="">
                        </div>
                        <div class="right">
                            <h3>
                            <a href="profile.html?username=${item.user['screen_name']}"
                             style="text-decoration: none; color: black;">`+item.user['name']+ `<span>`+item.user['screen_name']+`</a>
                            </span></h3>
                        </div>
                    </div> 
                    <div class="bottom mt-3">
                        <p>${textWithMentions.map((part) => part.startsWith('@') ? `<a href="profile.html?username=${part}" class="hashtag">${part}</a>` : part).join(' ')} </p>
                        <p>`+item.created_at+ `</p>
                        <div class="links" style="padding-top: 15px;padding-bottom: 7px;border-top: 1px solid #eaeaea;border-bottom: 1px solid #eaeaea;">
                            <div class="link" style="">
                                <i class="bi bi-chat-right"></i>
                                <h5>`+item.reply_count+ `</h5>
                            </div>
                            <div class="link">
                                <i class="bi bi-recycle"></i>
                                <h5>`+item.reslime_count+ `</h5>
                            </div>
                            <div class="link">
                                <i class="fa-regular fa-heart"></i>
                                <h5>`+item.favorite_count+ `</h5>
                            </div>
                            <div class="link">
                                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                            </div>
                        </div>
                    </div>
                </div> </div> `;
            });
      }
      
      container.appendChild(app);
    } catch (error) {
      console.error(error);
    }
  };

  await appendDataToElement('slime', jsonFiles[0]);
  await appendDataToElement('slimeReply', jsonFiles[1]);
}

init();

});