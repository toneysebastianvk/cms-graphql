const { ApolloServer, gql } = require("apollo-server");
const { AmplienceGraphQLApi } = require("./api");

// Step 1: Define the GraphQL Schema

const typeDefs = gql`
  scalar JSON

  type Query {
    hello: String
    getAmplienceContent(deliveryKey: String, preview: Boolean): AmplienceContent
  }

  type AmplienceContent {
    page: Page
  }

  type Page {
    slots: [Slots]
  }

  union Slots = Carousel | Heromini | Banner | Contentcarousel | Slot

  type Carousel {
    rawJson: CarouselRawJson
  }

  type CarouselRawJson {
    content: CarouselContent
  }
  type CarouselContent {
    subheadlinePlainText: String
    component: String
    snipeText: String
    _meta: Meta
    items: [CarouselItem]
    height: Int
    headlineText: String
  }
  type CarouselItem {
    items: [CarouselItemContent]
    _meta: Meta
  }
  type CarouselItemContent {
    headlineText: String
    subheadlinePlainText: String
    target: CarouselItemTarget
    mediaType: String
    mediaExternalId: String
  }
  type CarouselItemTarget {
    targetType: String
  }
  type Meta {
    schema: String
    name: String
    deliveryId: String
  }
  type Heromini {
    media: HeroMedia
    rawJson: HeroMiniRawJson
  }

  type HeroMedia {
    id: String
    url: String
  }

  type HeroMiniRawJson {
    content: HeroMiniContent
  }

  type HeroMiniContent {
    teasertargets: [TeaserTarget]
    _meta: Meta
    styles: HeroMiniStyles
    media: Media
    teaser: Teaser
    isPersonalization: Boolean
    shoppableHeroImage: ShoppableHeroImage
  }

  type TeaserTarget {
    _meta: Meta
    items: [TeaserItem]
  }

  type TeaserItem {
    headlineText: String
    target: TeaserItemTarget
  }

  type TeaserItemTarget {
    url: String
  }

  type Meta {
    schema: String
    name: String
    deliveryKey: String
    deliveryId: String
  }

  type HeroMiniStyles {
    useTextLinks: Boolean
    centerCopyText: Boolean
    twoColumns: Boolean
    linkedStyles: LinkedStyles
    width: Int
  }

  type LinkedStyles {
    desktopStyle: String
    mobileStyle: String
  }

  type Media {
    _meta: Meta
    id: String
    name: String
    endpoint: String
    defaultHost: String
    mimeType: String
  }

  type Teaser {
    headline: TeaserHeadline
    subheadline: TeaserSubheadline
    teaserTitle: String
    snipeText: String
    _meta: Meta
  }

  type TeaserHeadline {
    teaserTitle: String
    style: String
  }

  type TeaserSubheadline {
    teaserTitle: String
    style: String
  }
  type Banner {
    rawJson: JSON
  }

  type Contentcarousel {
    rawJson: JSON
  }

  type Slot {
    rawJson: JSON
  }

  # ---------- Point of Interest -------------
  type ShoppableHeroImage {
    shoppableImage: ShoppableImage
    polygonHide: Boolean
    component: String
    _meta: MetaData
  }
  type ShoppableImage {
    image: Image
    poi: PointOfInterest
    hotspots: [Hotspot]
    polygons: [Polygon]
  }
  type Image {
    _meta: MetaData
    id: ID
    name: String
    endpoint: String
    defaultHost: String
    mimeType: String
  }
  type PointOfInterest {
    x: Float
    y: Float
    w: Float
    h: Float
  }
  type Hotspot {
    id: ID
    target: String
    selector: String
    points: Point
  }

  type Point {
    x: Float
    y: Float
  }

  type Polygon {
    id: ID
    target: String
    selector: String
    points: [Point]
  }

  type MetaData {
    schema: String
  }
`;

// Step 2: Define the Resolvers
const resolvers = {
  Query: {
    hello: () => {
      return "Hello, world!";
    },
    async getAmplienceContent(_parent, args) {
      const amplienceGraphQLApi = new AmplienceGraphQLApi(args.preview);
      const result = await amplienceGraphQLApi.getModule(args.deliveryKey);
      return result;
    },
  },
};

// Step 3: Set up the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

// Step 4: Launch the server
server.listen({ port: 3000, path: "/graphql" }).then(({ url }) => {
  console.log(`Server ready at ${url}graphql`);
});
