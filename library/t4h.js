const axios = require('axios');
const { JSDOM } = require('jsdom');

module.exports = {
    get: async (query) => {
        try {
            const { data } = await axios.get(`https://tools4hack.santalab.me/${query ? `?s=${query}` : ''}`);
            const document = new JSDOM(data).window.document;
            const titles = Array.from((document.querySelectorAll('h2.entry-card-title.card-title.e-card-title')), item => item.textContent);
            const snippets = Array.from((document.querySelectorAll('div.entry-card-snippet.card-snippet.e-card-snippet')), item => item.textContent.trim());
            const thumbs = Array.from((document.querySelectorAll('img.entry-card-thumb-image.card-thumb-image.wp-post-image')), item => item.getAttribute('src'));
            const links = Array.from((document.querySelectorAll('a.entry-card-wrap.a-wrap.border-element.cf')), item => item.getAttribute('href'));
            if (!titles[0]) return;
            const article = [];
            for (let i = 0; i <= 4; i++) {
                article.push(
                    {
                        title:titles[i],
                        snippet:snippets[i],
                        thumbnail:thumbs[i],
                        link:links[i]
                    }
                )
            }
            return article;
        } catch (err) {
            console.error(err);
        }
    }
}