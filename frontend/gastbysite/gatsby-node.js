
exports.createPages = async function ({ graphql, actions }) {

    const query = await graphql(`
    query MyQuery {
        gatsbyappsync {
          listLollies {
            flavourBottom
            flavourMedium
            flavourTop
            id
            lollyPath
            message
            sender
            recipientName
          }
        }
      }
      
    
    `)

    console.log(JSON.stringify(query))

    const lollies = query.data.gatsbyappsync.listLollies;

    console.log("lolles", lollies)

    lollies.map((lolly) => {
        actions.createPage({
            path: `/${lolly.lollyPath}`,
            component: require.resolve('./src/templates/showLolly.tsx'),
            context: lolly,
        })

    })

    console.log("End of Gatsby Node File");





}

exports.onCreatePage = async ({page, actions}) => {
    const {createPage} =  actions

    if(page.path.match(/^\/lolly/)){
        page.matchPath = "/lolly/*"

        createPage(page)

    }

}

