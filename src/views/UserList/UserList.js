import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "./components/UserListResults";
import UserListToolbar from "./components/UserListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadUsers, pageChanged } from "src/store/users";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { set, omit, isEmpty, find, forEach, slice } from 'lodash';

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(loadUsers(1));
  }, []);

  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.users);
  const [paginatedList, setPaginatedList] = useState([]);

  const [selectionModel, setSelectionModel] = useState([]);
  const prevSelectionModel = useRef(selectionModel);
  const onSelectionModelChange = (newSelectionModel) => setSelectionModel(newSelectionModel);

  useEffect(() => {
    const sliceStart = pageSize * (page - 1);
    const sliceEnd = pageSize * page;
    const rowsToDisplay = slice(list, sliceStart, sliceEnd);
    if (!isEmpty(rowsToDisplay)) {
      setPaginatedList(rowsToDisplay);
    }

  }, [list, rowCount, pageSize, page]);

  useEffect(() => {
    setTimeout(() => {
      setSelectionModel(prevSelectionModel.current);
    }, 150);
  }, [page])

  // Pagination
  const onPageChange = targetPage => {
    // Save selectionModel
    prevSelectionModel.current = selectionModel;
    const actualTargetPage = targetPage + 1;
    if (actualTargetPage < page) {
      // navigating back
      dispatch(pageChanged({ page: actualTargetPage }));
      return;
    } else {
      // navigating forward
      const numberOfPagesLoaded = Math.ceil(list.length / pageSize);
      if (actualTargetPage > numberOfPagesLoaded) {
        // not loaded before
        dispatch(loadUsers(actualTargetPage));
      } else {
        // loaded before
        dispatch(pageChanged({ page: actualTargetPage }));
        return;
      }
    }
  }


  const [dialogSettings, setDialogSettings] = useState({ open: false });
  const [idsPendingDelete, setIdsPendingDelete] = useState({});

  return (
    <>
      <Helmet>
        <title>Users | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          display: 'flex',
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <UserListToolbar />
          <Box sx={{ height: '90%', mt: 2 }}>
            <UserListResults
              users={paginatedList}
              rowCount={rowCount}
              pageSize={pageSize}
              loading={loading}
              onPageChange={onPageChange}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              idsPendingDelete={idsPendingDelete}
            />
          </Box>

        </Container>
      </Box>
    </>
  );
};

export default UserList;
