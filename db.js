const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL);

const Page = conn.define('page', {
    name: Sequelize.STRING
});

const Content = conn.define('content', {
    title: Sequelize.STRING,
    body: Sequelize.STRING
});

const getPages = () => {
    return Page.findAll({
        attributes: ['id', 'name']
    })
}

const getContent = (id) => {
    return Content.findAll({
        where: {
            pageId: id
        }
    })
}

const initDb = async (force = false) => {
    try{
        Page.hasMany(Content);
        Content.belongsTo(Page);

        await conn.sync({force});

        const [home, employees, contact] = await Promise.all([
            Page.create({name: 'Home'}),
            Page.create({name: 'Employees'}),
            Page.create({name: 'Contact'})
        ])

        const homeContent = await Promise.all([
            Content.create({ title: 'Welcome Home 1', body: 'xoxoxo' }),
            Content.create({ title: 'Welcome Home 2', body: 'oxoxox' })
        ])

        const employeesContent = await Promise.all([
            Content.create({ title: 'Moe', body: 'CEO' }),
            Content.create({ title: 'Larry', body: 'CTO' }),
            Content.create({ title: 'Curly', body: 'COO'})
        ])

        const contactContent = await Promise.all([
            Content.create({ title: 'Phone', body: '(212) 555-1212' }),
            Content.create({ title: 'Teltex', body: '(212) 555-1213' }),
            Content.create({ title: 'Fax', body: '(212) 555-1214'})
        ])

        await home.setContents(homeContent);
        await employees.setContents(employeesContent);
        await contact.setContents(contactContent);
        
    } catch (e) {
        console.error(e);
    }
 }

module.exports = {
    initDb,
    getPages,
    getContent
}