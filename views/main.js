const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (pages) =>
  layout(html`
    <h3>Pages</h3>
    <hr />
    <form method="GET" action="/wiki/search">
      <input type="text" name="search" placeholder="Search Pages by Tag" />
      <button type="submit">Search</button>
    </form>
    <hr />
    ${pages.map((page) => {
      return html`
        <ul>
          <li>
            <a href="/wiki/${page.slug}"> ${page.title} </a>
          </li>
        </ul>
      `;
    })}
  `);
