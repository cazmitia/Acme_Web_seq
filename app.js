const express = require('express');
const db = require('./db');
const app = express();
module.exports = app;

const renderPage = (content, pages, id) => {
    return `
        <html>
            <head>
            <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' />
            </head>
            <body>
                <div class='container'>
                    <h1> Acme Web </h1>
                    <h2> ${pages.find(page => page.id === id * 1).name}</h2>
                    <ul class='nav nav-tabs'>
                        ${pages.map(page => {
                            let active = (page.id === id * 1 ? `class='nav-link active'` : `class='nav-link'`);
                            return `<li class='nav-item'>
                                <a  href='/pages/${page.id}' ${active}>
                                    ${page.name}
                                <a>
                            </li>
                            `;
                        }).join('')}
                    </ul>
                    <ul class='list-group'>
                        ${content.map(pageContent => {
                            return `
                                <li class='list-group-item'>
                                ${pageContent.title}
                                <br />
                                ${pageContent.body}
                                </li>                       
                            `
                        }).join('')}
                    </ul>
                </div>
            </body>
        </html>
    `
}

app.use((req, res, next) => {
    db.getPages()
        .then(pages => {
            req.pages = pages;
            next();
        })
        .catch(next);
})

app.get('/', (req, res, next) => {
    const home = req.pages.find(page => page.id === 1);
    res.redirect(`/pages/${home.id}`)
})

app.get('/pages/:id', (req, res, next) => {
    db.getContent(req.params.id)
        .then(content => res.send(renderPage(content, req.pages, req.params.id)))
        .catch(next);
});
