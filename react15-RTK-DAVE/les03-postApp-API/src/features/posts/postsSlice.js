import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = {
  posts: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
export const fetchPosts = createAsyncThunk('getme', async () => {
    const response = await fetch(POSTS_URL)
    return response.json();
})







const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, body, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            date: new Date().toISOString(),
            body,
            userId : Number(userId),
            reactions: {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0
            }
          },
        };
      },
    },

    addReaction(state, action) {
        const { postId, reaction } = action.payload
        const existingPost = state.posts.find(post => post.id === postId)
        if (existingPost) {
            existingPost.reactions[reaction]++
        }
    }
  },
  extraReducers(builder) {
    builder
        .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Adding date and reactions
            let min = 1;
            const loadedPosts = action.payload.map(post => {
                post.date = sub(new Date(), { minutes: min++ }).toISOString();
                post.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                return post;
            });

            // Add any fetched posts to the array
            state.posts = [...loadedPosts]
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
      }
});

export const selectAllPosts =  (state) => state.poo.posts;
export const getPostsStatus = (state) => state.poo.status;
export const getPostsError = (state) => state.poo.error;

export const { addPost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;
