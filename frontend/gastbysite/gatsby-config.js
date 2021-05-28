

const dotenv = require("dotenv").config()



/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
module.exports = {
  /* Your site config here */
  plugins: ["gatsby-plugin-typescript",
  {
    resolve: "gatsby-source-graphql",
    options: {
      typeName: 'gatsbyappsync',
      fieldName: 'gatsbyappsync',
      url: "https://qlfnmsryxzhupp5ynfrg7gfgfq.appsync-api.us-west-2.amazonaws.com/graphql",
      headers: {
        'x-api-key': "da2-lc5juer35bgprbexkivsawjqc4"
      }
    }
  }
]

}