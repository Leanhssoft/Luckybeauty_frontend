import * as React from 'react';
import { Typography, TextField, Stack, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { OpenInNew, LocalOffer, Search } from '@mui/icons-material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import utils from '../../utils/utils';
import { IList } from '../../services/dto/IList';

interface IPropsTreeView {
    roleEdit: boolean;
    isShowCheckAll?: boolean;
    isShowCheckbox?: boolean;
    arrItemChosedDefault?: string[];
    lstData: IList[];
    clickTreeItem: (isEdit?: boolean, arrIdChosed?: string[] | null) => void;
}

export default function TreeViewGroupProduct({
    roleEdit,
    isShowCheckAll,
    arrItemChosedDefault,
    lstData,
    clickTreeItem
}: IPropsTreeView) {
    const [rowIdHover, setRowIdHover] = React.useState<string | null>();
    const [isHover, setIsHover] = React.useState(false);
    const [textSearch, setTextSearch] = React.useState('');
    const [arrIdChosed, setArrIdChosed] = React.useState<string[]>([]);

    const handleHover = (event: React.MouseEvent<HTMLElement>, rowData: IList) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowIdHover(rowData?.id);
    };
    const handleClickTreeItem = (isEdit = false, idChosed: string) => {
        clickTreeItem(isEdit, [idChosed]);
    };
    const handleClickAll = () => {
        setRowIdHover(null);
        clickTreeItem(false, null);
    };

    const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, item: IList) => {
        const isCheck = event.target.checked;
        const arrIdChild = item?.children?.map((x) => {
            return x?.id;
        });
        let arrOld = arrIdChosed?.filter((x) => x !== item?.id);
        if (arrIdChild) {
            arrOld = arrOld?.filter((x) => !arrIdChild.includes(x));
        }
        let arrNew = [...arrOld];

        if (isCheck) {
            arrNew = [item?.id, ...arrOld, ...(arrIdChild ?? [])];
        }
        setArrIdChosed([...arrNew]);
        clickTreeItem(false, arrNew);
    };

    const dataTreeSearch = lstData?.filter((x: IList) => {
        const txt = textSearch.trim().toLowerCase();
        const txtUnsign = utils.strToEnglish(txt);
        return (
            (x?.text !== null && x?.text !== undefined && x?.text?.trim().toLowerCase().indexOf(txt) > -1) ||
            (x?.text2 !== null && x?.text2 !== undefined && x.text2.trim().toLowerCase().indexOf(txt) > -1) ||
            (x?.text !== null && x?.text !== undefined && utils.strToEnglish(x?.text).indexOf(txtUnsign) > -1) ||
            (x?.text2 !== null && x?.text2 !== undefined && utils.strToEnglish(x?.text2).indexOf(txtUnsign) > -1)
        );
    });

    return (
        <>
            <Stack spacing={1}>
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Tìm nhóm dịch vụ"
                    InputProps={{ startAdornment: <Search /> }}
                    onChange={(e) => setTextSearch(e.target.value)}
                />
                <Stack
                    direction="row"
                    alignItems={'center'}
                    onClick={handleClickAll}
                    spacing={1}
                    sx={{
                        cursor: 'pointer',
                        display: isShowCheckAll ?? false ? '' : 'none',
                        backgroundColor: (arrIdChosed?.length ?? 0) === 0 ? 'var(--color-bg)' : '',
                        '&:hover': {
                            bgcolor: 'var(--color-bg)'
                        }
                    }}>
                    <FormGroup sx={{ width: '100%' }}>
                        <FormControlLabel control={<Checkbox />} label="Tất cả" />
                    </FormGroup>
                </Stack>
            </Stack>
            <Stack spacing={1} overflow={'auto'} maxHeight={500}>
                {dataTreeSearch?.map((item, index) => (
                    <Stack
                        sx={{
                            borderBottom: '1px solid #ccc'
                        }}
                        key={index}
                        onMouseLeave={(event) => {
                            handleHover(event, item);
                        }}
                        onMouseEnter={(event) => {
                            handleHover(event, item);
                        }}>
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'var(--color-bg)'
                                }
                            }}>
                            <FormGroup sx={{ width: '100%' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={arrIdChosed.includes(item.id)}
                                            onChange={(event) => handleChangeCheckbox(event, item)}
                                        />
                                    }
                                    label={item.text}
                                />
                            </FormGroup>
                            {isHover && rowIdHover === item.id && roleEdit && (
                                <OpenInNew onClick={() => handleClickTreeItem(true, item?.id)} />
                            )}
                        </Stack>
                        {item?.children?.map((child: IList, index2) => (
                            <Stack
                                key={index2}
                                sx={{
                                    borderTop: '1px solid #ccc',
                                    '&:hover': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}
                                onMouseLeave={(event) => {
                                    handleHover(event, child);
                                }}
                                onMouseEnter={(event) => {
                                    handleHover(event, child);
                                }}>
                                <Stack
                                    paddingLeft={1.5}
                                    direction={'row'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}>
                                    <FormGroup sx={{ width: '100%' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={arrIdChosed.includes(child.id)}
                                                    onChange={(event) => handleChangeCheckbox(event, child)}
                                                />
                                            }
                                            label={child.text}
                                        />
                                    </FormGroup>
                                    {isHover && rowIdHover === child.id && roleEdit && (
                                        <OpenInNew onClick={() => handleClickTreeItem(true, child?.id)} />
                                    )}
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                ))}
            </Stack>
        </>
    );
}
