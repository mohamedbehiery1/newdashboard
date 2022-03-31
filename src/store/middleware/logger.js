
const logger = logging => store => next => action => {
    console.log('Logging to: ', logging);
    next(action);
};

export default logger;