import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBugs, getUnresolvedBugs, resolveBug } from '../store/bugs';

const BugsList = () => {

    const dispatch = useDispatch();

    // useSelector(state => state.entities.bugs.list)
    const bugs = useSelector(getUnresolvedBugs);

    const fetchBugs = useCallback(() => {
        dispatch(loadBugs())
    }, [])

    useEffect(fetchBugs, [])

    return (
        <ul>
            {
                bugs.map(
                    bug =>
                        <li key={bug.id}>
                            {bug.description}
                            <button onClick={() => dispatch(resolveBug(bug.id))}>
                                Resolve
                            </button>
                        </li>
                )
            }
        </ul>
    )
}

export default BugsList;