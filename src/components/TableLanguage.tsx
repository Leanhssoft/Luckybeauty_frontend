export const TextTranslate = {
    columnMenuUnsort: 'Bỏ sắp xếp',
    columnMenuSortAsc: 'Sắp xếp tăng dần',
    columnMenuSortDesc: 'Sắp xếp giảm dần',
    columnMenuFilter: 'Lọc',
    columnMenuHideColumn: 'Ẩn cột',
    columnMenuManageColumns: 'Điều chỉnh tất cả cột',
    checkboxSelectionHeaderName: 'Chọn',
    columnsPanelTextFieldLabel: 'Tìm cột',
    columnsPanelTextFieldPlaceholder: 'Tên cột',
    columnsPanelHideAllButton: 'Ẩn tất cả',
    columnsPanelShowAllButton: 'Hiển thị tất cả',
    filterPanelOperator: 'Toán tử',
    filterOperatorContains: 'Chứa',
    filterOperatorEquals: 'Bằng',
    filterOperatorNot: 'Không Bằng',
    filterOperatorStartsWith: 'Bắt đầu với',
    filterOperatorEndsWith: 'Kết thúc với',
    filterOperatorIsEmpty: 'Rỗng',
    filterOperatorIsNotEmpty: 'Không trống',
    filterOperatorIsAnyOf: 'Là bất kỳ trong',
    filterPanelColumns: 'Cột',
    filterPanelInputLabel: 'Giá trị',
    filterPanelInputPlaceholder: 'Nhập giá trị để tìm kiếm',
    noRowsLabel: 'không có dữ liệu',
    noResultsOverlayLabel: 'Không có kết quả phù hợp.',
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
        `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}does nothing`,
    MuiTablePagination: {
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
            `hiển thị ${from} - ${to} của ${count} mục`,
        labelRowsPerPage: 'Số hàng tối đa trên mỗi trang '
    },
    labelRowsPerPage: 'Số hàng tối đa trên mỗi trang ',
    footerRowSelected: (count: number) =>
        count !== 1 ? `${count.toLocaleString()} Hàng được chọn` : `${count.toLocaleString()} Hàng được chọn `
};
