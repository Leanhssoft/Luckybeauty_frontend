/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, Typography, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IList } from '../../services/dto/IList';
import utils from '../../utils/utils';

export default function CmpIListData({ lst, Icon, direction, clickTreeItem, isShowAll }: any) {
    //isShowAll:  hiện "Tất cả"
    const [rowHover, setRowHover] = useState<IList>({} as IList);
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');
    const [lstSearch, setLstSearch] = useState<IList[]>([]);

    useEffect(() => {
        setLstSearch(lst);
    }, [lst]);

    const handleHover = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(rowData);
    };
    const handleClickTreeItem = (isEdit = false, idChosing: string) => {
        if (utils.checkNull(idChosing)) {
            clickTreeItem(isEdit, null);
        } else {
            clickTreeItem(isEdit, rowHover);
        }
        setIdChosing(idChosing);
    };
    const search = (textSearch: string) => {
        let txt = textSearch;
        let txtUnsign = '';
        if (!utils.checkNull(txt)) {
            txt = txt.trim();
            txtUnsign = utils.strToEnglish(txt);
        }
        const arr = lst.filter(
            (x: IList) => (x.text ?? '').indexOf(txt) > -1 || utils.strToEnglish(x.text ?? '').indexOf(txtUnsign) > -1
        );
        setLstSearch(arr);
    };
    return (
        <>
            <Stack direction={direction ?? 'column'} spacing={1}>
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Tìm kiếm"
                    InputProps={{ startAdornment: <Search /> }}
                    onChange={(e) => search(e.target.value)}
                />
                <Stack
                    padding={'8px 16px'}
                    sx={{
                        display: isShowAll ? 'flex' : 'none',
                        '&:hover': {
                            bgcolor: 'var(--color-bg)'
                        }
                    }}>
                    <Stack spacing={2} direction={'row'} position="relative" paddingRight={3}>
                        <div> {Icon}</div>

                        <Typography
                            variant="body2"
                            fontWeight={700}
                            textTransform="capitalize"
                            sx={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }}
                            onClick={() => handleClickTreeItem(false, '')}>
                            Tất cả
                        </Typography>
                    </Stack>
                </Stack>
                {lstSearch?.map((item: IList, index: number) => (
                    <Stack
                        key={index}
                        padding={'8px 16px'}
                        sx={{
                            '&:hover': {
                                bgcolor: 'var(--color-bg)'
                            },
                            bgcolor: idChosing === item.id ? '#F2EBF0' : ''
                        }}
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}>
                        <Stack
                            spacing={2}
                            direction={'row'}
                            position="relative"
                            paddingRight={3}
                            onClick={() => handleClickTreeItem(false, item.id)}>
                            <div style={{ color: item.color }}> {Icon}</div>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                                textTransform="capitalize"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}
                                title={item.text}>
                                {item.text}
                            </Typography>
                            {/* {isHover && item.id !== '' && rowHover.id === item.id && (
                                <OpenInNew
                                    onClick={() => handleClickTreeItem(true, item.id)}
                                    sx={{ position: 'absolute', right: 0.5 }}
                                />
                            )} */}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </>
    );
}
