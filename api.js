const axios = require('axios');
const compactGraphQLQuery = require("./graphql-compress");
const { getPage } = require("./getPage");

class AmplienceGraphQLApi {
  client;

  constructor(client) {
    const AMPLIENCE_BASE_URL =
      "https://uowk0qxoku001ufatmmwkv1fe.staging.bigcontent.io/";
    this.client =
      client ||
      axios.create({
        baseURL: AMPLIENCE_BASE_URL,
        headers: {
          "Content-Type": "application/json",
        },
      });
  }

  async getModule(deliveryKey) {
    const query = getPage.pageQuery(deliveryKey);
    const response = await this.performQuery(query);

    if (
      response.status !== 200 ||
      (response.data.errors && response.data.errors?.length > 0)
    ) {
      logger.error({
        message: "Error while calling Amplience",
        response: response.data,
        status: response.status,
      });

      throw new Error(
        `Error while calling Amplience: ${response.data.errors?.map(
          (err) => err.message
        )}`
      );
    }

    return response.data.data;
  }

  async performQuery(query) {
    const queryCleanup = compactGraphQLQuery(query);
    return this.client.post("/graphql", { query: queryCleanup });
  }
}

module.exports = {
  AmplienceGraphQLApi,
};
