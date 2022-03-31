const generateDataGridLocaleText = (t) => {
    const nameSpacedT = (string) => t(`datagrid:${string}`);
    
    return {
        noRowsLabel: nameSpacedT('No Data'),
        // Column menu text
        columnMenuLabel: nameSpacedT('Menu'),
        columnMenuShowColumns: nameSpacedT('Show columns'),
        columnMenuFilter: nameSpacedT('Filter'),
        columnMenuHideColumn: nameSpacedT('Hide'),
        columnMenuUnsort: nameSpacedT('Unsort'),
        columnMenuSortAsc: nameSpacedT('Sort by ASC'),
        columnMenuSortDesc: nameSpacedT('Sort by DESC'),
        // Columns panel text
        columnsPanelTextFieldLabel: nameSpacedT('Find column'),
        columnsPanelTextFieldPlaceholder: nameSpacedT('Column title'),
        columnsPanelDragIconLabel: nameSpacedT('Reorder column'),
        columnsPanelShowAllButton: nameSpacedT('Show all'),
        columnsPanelHideAllButton: nameSpacedT('Hide all'),
        // Filter operators text
        filterOperatorContains: nameSpacedT('contains'),
        filterOperatorEquals: nameSpacedT('equals'),
        filterOperatorStartsWith: nameSpacedT('starts with'),
        filterOperatorEndsWith: nameSpacedT('ends with'),
        filterOperatorIs: nameSpacedT('is'),
        filterOperatorNot: nameSpacedT('is not'),
        filterOperatorAfter: nameSpacedT('is after'),
        filterOperatorOnOrAfter: nameSpacedT('is on or after'),
        filterOperatorBefore: nameSpacedT('is before'),
        filterOperatorOnOrBefore: nameSpacedT('is on or before'),
        // Filter panel text
        filterPanelAddFilter: nameSpacedT('Add filter'),
        filterPanelDeleteIconLabel: nameSpacedT('Delete'),
        filterPanelOperators: nameSpacedT('Operators'),
        filterPanelOperatorAnd: nameSpacedT('And'),
        filterPanelOperatorOr: nameSpacedT('Or'),
        filterPanelColumns: nameSpacedT('Columns'),
        filterPanelInputLabel: nameSpacedT('Value'),
        filterPanelInputPlaceholder: nameSpacedT('Filter value'),
        // Checkbox selection text
        checkboxSelectionHeaderName: nameSpacedT("Checkbox selection"),
    };
}

export default generateDataGridLocaleText;