import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallStarted } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'bugs',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {
        bugsRequested: (bugs, action) => {
            bugs.loading = true
        },
        bugsRequestSucceded: (bugs, action) => {
            bugs.list = action.payload
            bugs.loading = false
            bugs.lastFetch = Date.now()
        },
        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false
        },
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload)
        },
        bugRemoved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id)
            bugs.list.splice(index, 1)
        },
        bugResolved: (bugs, action) => {
            const bug = bugs.list.find(bug => bug.id === action.payload.id)
            bug.resolved = true
        },
        bugAssignedToUser: (bugs, action) => {
            const { id, userId } = action.payload
            const bug = bugs.list.find(bug => bug.id === id)
            bug.userId = userId
        }
    }
})

const {
    bugsRequested,
    bugsRequestSucceded,
    bugsRequestFailed,
    bugAdded,
    // bugRemoved,
    bugResolved,
    bugAssignedToUser
} = slice.actions

// Selectors
export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    state => state.entities.projects,
    (bugs, projects) => bugs.list.filter(bug => !bug.resolved)
)

export const getBugsAssignedToUser = userId => createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
)

// Action Creators
const url = '/bugs'

export const loadBugs = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;
    const diffInMinutes = moment().diff(moment(lastFetch), 'M');
    if (diffInMinutes < 10) return
    dispatch(
        apiCallStarted({
            url,
            onStart: bugsRequested.type,
            onSuccess: bugsRequestSucceded.type,
            onError: bugsRequestFailed.type
        })
    )
}

export const addBug = bug => apiCallStarted({
    url,
    method: 'post',
    data: bug,
    onSuccess: bugAdded.type
})

export const resolveBug = bugId => apiCallStarted({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { resolved: true },
    onSuccess: bugResolved.type
})

export const assignBugToUser = (bugId, userId) => apiCallStarted({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type
})

export default slice.reducer;
