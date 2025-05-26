import {apiSlice} from './apiSlice.ts';

const GENRE_URL = '/api/v1/genre';



export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (data) => ({
        url: GENRE_URL,
        method: 'POST',
        body: data
      })
      
    }),
    updateGenre: builder.mutation({
      query: ({id, updateGenre}) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'PUT',
        body: updateGenre
      })
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'DELETE'
      })
    }),
    getGenres: builder.query({
      query: () => ({
        url: `${GENRE_URL}/genres`
      })
    }),
    getGenre: builder.query({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`
      })
    })
  })
})

export const {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetGenresQuery,
  useGetGenreQuery
} = genreApiSlice;