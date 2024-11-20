import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import abpCustom from '../../../components/abp-custom';
import AddIcon from '../../../images/add.svg';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import editionService from '../../../services/editions/editionService';
import { EditionListDto } from '../../../services/editions/dto/EditionListDto';
import CreateOrEditEditionModal from './createOrEditEditionModal';
import CreateOrEditEditionDto from '../../../services/editions/dto/CreateOrEditEditionDto';
import NameValueDto from '../../../services/dto/NameValueDto';
import FlatFeatureDto from '../../../services/editions/dto/FlatFeatureDto';
import ActionRow2Button from '../../../components/DataGrid/ActionRow2Button';
import { TypeAction } from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
const index = () => {
    const [listData, setListData] = useState([] as EditionListDto[]);
    const [visiable, setVisiable] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
    const [createOrEditInput, setCreateOrEditInput] = useState({} as CreateOrEditEditionDto);
    const [allFeatureValues, setAllFeatureValues] = useState([] as NameValueDto[]);
    const [allFeatures, setAllFeatures] = useState([] as FlatFeatureDto[]);
    const getEditions = async () => {
        const data = await editionService.getAllEdition();
        setListData(data.items);
    };
    useEffect(() => {
        getEditions();
        getFeatureDetail();
    }, []);
    const onModal = () => {
        setVisiable(!visiable);
    };
    const getFeatureDetail = async () => {
        const data = await editionService.getAllFeature();
        setAllFeatureValues(data.featureValues);
        setAllFeatures(data.features);
    };
    const getForEdit = async (id: number) => {
        const data = await editionService.getForEdit(id);
        if (id === 0) {
            setCreateOrEditInput({
                edition: {
                    id: 0,
                    displayName: '',
                    name: '',
                    price: 0
                },
                featureValues: data.featureValues
            });
        } else {
            setCreateOrEditInput({ edition: data.edition, featureValues: data.featureValues });
        }
        onModal();
    };
    const onOkDelete = async () => {
        const response = await editionService.deleteEdition(selectedRowId);
        response.success == true
            ? enqueueSnackbar('Xóa phiên bản thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Xóa phiên bản thất bại', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        getEditions();
        setIsShowConfirmDelete(false);
    };
    const handleClickAction = async (type: number, param: GridCellParams) => {
        setSelectedRowId(Number.parseInt(param.id.toString()) ?? 0);
        switch (type) {
            case TypeAction.DELETE:
                {
                    const role = abpCustom.isGrandPermission('Pages.Editions.Delete');
                    if (!role) {
                        enqueueSnackbar('Không có quyền xóa phiên bản', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    setIsShowConfirmDelete(true);
                }
                break;
            case TypeAction.UPDATE:
                {
                    const role = abpCustom.isGrandPermission('Pages.Editions.Edit');
                    if (!role) {
                        enqueueSnackbar('Không có quyền cập nhật phiên bản', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    getForEdit(Number.parseInt(param.id.toString()));
                }
                break;
        }
    };
    const columns = [
        {
            field: 'displayName',
            headerName: 'Tên phiên bản',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'price',
            headerName: 'Giá',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },

        {
            field: 'creationTime',
            headerName: 'Thời gian tạo',
            minWidth: 150,
            headerAlign: 'center',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-GB')}</Typography>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: 'Hành động',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params) => (
                <ActionRow2Button handleClickAction={(type: number) => handleClickAction(type, params)} />
            ),
            renderHeader: (params) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
        }
    ] as GridColDef[];
    return (
        <Box
            sx={{
                paddingTop: '16px'
            }}>
            <Box display={'flex'} flexDirection={'row'} gap={0.5} justifyContent={'space-between'}>
                <Typography variant="h1" fontWeight="700" fontSize="16px" color="#333233">
                    Phiên bản
                </Typography>
                <Button
                    hidden={!abpCustom.isGrandPermission('Pages.Editions.Create')}
                    variant="contained"
                    startIcon={<img src={AddIcon} />}
                    size="small"
                    sx={{
                        height: '40px',
                        fontSize: '14px',
                        textTransform: 'unset',
                        fontWeight: '400',
                        backgroundColor: 'var(--color-main)!important'
                    }}
                    onClick={() => {
                        getForEdit(0);
                    }}>
                    Tạo phiên bản mới
                </Button>
            </Box>
            <Box mt={2} className="page-content">
                <DataGrid
                    rowHeight={46}
                    columns={columns}
                    rows={listData}
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            background: '#EEF0F4'
                        }
                    }}
                    hideFooterPagination
                    hideFooter
                    localeText={TextTranslate}></DataGrid>
            </Box>
            <CreateOrEditEditionModal
                visible={visiable}
                onCancel={onModal}
                onOk={() => {
                    getEditions();
                    onModal();
                }}
                formRef={createOrEditInput}
                allFeatureValues={allFeatureValues}
                allFeatures={allFeatures}
            />
            <ConfirmDelete
                isShow={isShowConfirmDelete}
                onOk={onOkDelete}
                onCancel={() => {
                    setIsShowConfirmDelete(false);
                }}
            />
        </Box>
    );
};

export default index;
