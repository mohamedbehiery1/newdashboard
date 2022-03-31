import { createSlice } from '@reduxjs/toolkit';

let lastId = 0;

let projects = createSlice({
    name: 'projects',
    initialState: [],
    reducers: {
        projectAdded: (projects, action) => {
            projects.push({
                id: ++lastId,
                name: action.payload.name
            })
        }
    }
});

export const { projectAdded } = projects.actions;
export default projects.reducer;