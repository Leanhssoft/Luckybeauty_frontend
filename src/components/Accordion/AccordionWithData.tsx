import { Accordion, AccordionSummary, Typography, Box, Stack, TextField } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';

import { useState } from 'react';
import { OpenInNew } from '@mui/icons-material';
import utils from '../../utils/utils'; // func common
import { IList } from '../../services/dto/IList';

interface IParamAccordion {
    roleEdit: boolean;
    lstData: IList[];
    clickTreeItem: (isEdit?: boolean, itemChosed?: IList | null) => void;
}

export default function AccordionWithData({ roleEdit, lstData, clickTreeItem }: IParamAccordion) {
    const [rowHover, setRowHover] = useState<IList>({} as IList);
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');
    const [textSearch, setTextSearch] = useState('');

    const lstSearch = lstData.filter(
        (x) =>
            (x.text !== null && x.text.trim().toLowerCase().indexOf(textSearch) > -1) ||
            (x.text2 !== null && x.text2 !== undefined && x?.text2.trim().toLowerCase().indexOf(textSearch) > -1) ||
            (x.text !== null && x.text2 !== undefined && utils.strToEnglish(x.text).indexOf(textSearch) > -1) ||
            (x.text2 !== null && x.text2 !== undefined && utils.strToEnglish(x?.text2).indexOf(textSearch) > -1)
    );

    const handleHover = (event: React.MouseEvent<HTMLDivElement>, rowData: IList) => {
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
    return (
        <>
            <Box>
                <Stack spacing={1} paddingTop={1}>
                    <TextField
                        variant="standard"
                        fullWidth
                        placeholder="Tìm kiếm"
                        value={textSearch}
                        InputProps={{ startAdornment: <SearchIcon /> }}
                        onChange={(e) => setTextSearch(e.currentTarget.value)}
                    />
                    <Accordion
                        disableGutters
                        sx={{
                            boxShadow: 'unset',
                            '&.MuiAccordion-root::before': { content: 'none' },
                            '& .MuiAccordionSummary-root': { minHeight: '46px', maxHeight: '46px' }
                        }}>
                        <AccordionSummary
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                    bgcolor: 'var(--color-bg)'
                                },
                                '& .MuiAccordionSummary-content': {
                                    alignItems: 'end'
                                }
                            }}
                            onClick={() => handleClickTreeItem(false, '')}>
                            <PersonOutlineIcon sx={{ color: 'var(--color-main)' }} />
                            <Typography
                                variant="body2"
                                fontWeight="700"
                                textTransform="capitalize"
                                sx={{
                                    marginLeft: '9px',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                    paddingRight: '20px'
                                }}
                                title={'Tất cả'}>
                                Tất cả
                            </Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Box sx={{ marginTop: '0px!important', overflow: 'auto', maxHeight: '70vh' }}>
                        {lstSearch?.map((item: IList, index: any) => (
                            <Accordion
                                disableGutters
                                key={index}
                                sx={{
                                    boxShadow: 'unset',
                                    '&.MuiAccordion-root::before': { content: 'none' },
                                    '& .MuiAccordionSummary-root': { minHeight: '46px', maxHeight: '46px' }
                                }}>
                                <AccordionSummary
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        bgcolor: idChosing === item.id ? 'var(--color-bg)' : '',
                                        '&:hover': {
                                            bgcolor: 'var(--color-bg)'
                                        },
                                        '& .MuiAccordionSummary-content': {
                                            alignItems: 'end'
                                        }
                                    }}
                                    onMouseLeave={(event) => {
                                        handleHover(event, item);
                                    }}
                                    onMouseEnter={(event) => {
                                        handleHover(event, item);
                                    }}
                                    onClick={() => handleClickTreeItem(false, item.id)}>
                                    {item?.icon}
                                    <Typography
                                        variant="body2"
                                        fontSize="14px"
                                        fontWeight="700"
                                        textTransform="capitalize"
                                        sx={{
                                            marginLeft: '9px',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 1,
                                            paddingRight: '20px'
                                        }}
                                        title={item.text}>
                                        {item.text}
                                    </Typography>
                                    {isHover && item.id !== '' && rowHover.id === item.id && roleEdit && (
                                        <OpenInNew
                                            onClick={(event) => {
                                                event.stopPropagation(); // dừng không cho gọi đến sự kiện click của parent
                                                handleClickTreeItem(true, item.id);
                                            }}
                                            sx={{ position: 'absolute', right: 16 }}
                                        />
                                    )}
                                </AccordionSummary>
                            </Accordion>
                        ))}
                    </Box>
                </Stack>
            </Box>
        </>
    );
}
