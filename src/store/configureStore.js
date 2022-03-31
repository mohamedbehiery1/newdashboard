import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import api from './middleware/api';
import reducer from './reducer';

const configure = function () {
    return configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware(),
            api
        ]
    });
};

export default configure;