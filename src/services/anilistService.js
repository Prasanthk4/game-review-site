const ANILIST_API_URL = 'https://graphql.anilist.co';

const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    console.log('Making request with variables:', variables);
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    return data.data;
  } catch (error) {
    console.error('AniList API Error:', error);
    throw error;
  }
};

export const anilistService = {
  // Search media with filters
  searchMedia: async ({ type, sort, genres, search, page = 1, perPage = 24 }) => {
    const query = `
      query ($page: Int, $perPage: Int, $search: String, $type: MediaType, $sort: [MediaSort], $genres: [String]) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(type: $type, sort: $sort, genre_in: $genres, search: $search) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            startDate {
              year
              month
              day
            }
            description
            averageScore
            popularity
            trending
            genres
            format
            status
            episodes
            chapters
            volumes
            trailer {
              id
              site
              thumbnail
            }
          }
        }
      }
    `;

    const variables = {
      page,
      perPage,
      search: search || undefined,
      type: type?.toUpperCase(),
      sort: [sort || "TRENDING_DESC"],
      genres: genres?.length > 0 ? genres : undefined
    };

    const data = await makeGraphQLRequest(query, variables);
    return {
      media: data.Page.media,
      pageInfo: data.Page.pageInfo
    };
  },

  // Get details by ID
  getDetails: async (id) => {
    const query = `
      query ($id: Int) {
        Media(id: $id) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          bannerImage
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          description
          averageScore
          meanScore
          popularity
          trending
          favourites
          genres
          format
          status
          episodes
          duration
          chapters
          volumes
          source
          hashtag
          trailer {
            id
            site
            thumbnail
          }
          externalLinks {
            url
            site
          }
          rankings {
            rank
            type
            season
            allTime
          }
          studios(isMain: true) {
            nodes {
              name
              siteUrl
            }
          }
          relations {
            edges {
              relationType
              node {
                id
                title {
                  romaji
                  english
                }
                format
                type
                status
                coverImage {
                  medium
                }
              }
            }
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { id });
    return data.Media;
  }
};

export default anilistService;
