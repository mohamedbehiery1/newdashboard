import { createAction } from '@reduxjs/toolkit';

export const apiCallStarted = createAction('api/callStarted');
export const apiCallSucceeded = createAction('api/callSucceeded');
export const apiCallFailed = createAction('api/callFailed');