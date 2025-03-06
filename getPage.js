class getPage {
  static pageQuery(deliveryKey) {
    return `
        query getAmpliencePage {
        page(deliveryKey: "${deliveryKey}") {
          slots {
            __typename
            ... on Heromini {
              media {
                id
                url
                __typename
              }
              rawJson {
                content
              }
            }
            ... on Carousel {
              rawJson {
                content
              }
            }
          }
        }
      }
      `;
  }
}

module.exports = {
  getPage,
};
