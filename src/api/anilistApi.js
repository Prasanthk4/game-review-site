const searchAnime = async (query = '', type = 'ANIME', page = 1, filters = {}) => {
  const graphqlQuery = `
    query ($page: Int, $search: String, $type: MediaType, $sort: [MediaSort], $genre_in: [String], $seasonYear: Int, $status: MediaStatus) {
      Page(page: $page, perPage: 50) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(
          type: $type,
          sort: $sort,
          search: $search,
          genre_in: $genre_in,
          seasonYear: $seasonYear,
          status: $status
        ) {
          id
          title {
            english
            romaji
            native
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          episodes
          status
          seasonYear
          averageScore
          genres
          startDate {
            year
          }
          trailer {
            id
            site
          }
          studios {
            nodes {
              name
            }
          }
          siteUrl
        }
      }
    }
  `;

  try {
    const variables = {
      type,
      page,
      sort: [filters.sort || 'POPULARITY_DESC'],
      ...(query && { search: query }),
      ...(filters.genres?.length > 0 && { genre_in: filters.genres }),
      ...(filters.year && { seasonYear: parseInt(filters.year) }),
      ...(filters.status && { status: filters.status })
    };

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
  }
};

export { searchAnime };
