import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useState } from 'react';
import { OpenInNew, LocalOffer } from '@mui/icons-material';
import { SuggestNhomKhachDto } from '../../services/suggests/dto/SuggestNhomKhachDto';
import utils from '../../utils/utils'; // func common
import { red } from '@mui/material/colors';
import abpCustom from '../abp-custom';

export default function AccordionNhomKhachHang({ dataNhomKhachHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<SuggestNhomKhachDto>({} as SuggestNhomKhachDto);
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');

    const handleHover = (event: any, rowData: any, index: number) => {
        const data = JSON.parse(JSON.stringify(rowData));
        const objNhomKhach: SuggestNhomKhachDto = { id: data.id, tenNhomKhach: data.tenNhomKhach };
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(objNhomKhach);
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
            <Accordion
                disableGutters
                sx={{
                    // borderBottom: '1px solid #cccc',
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
            {dataNhomKhachHang?.map((item: any, index: any) => (
                <Accordion
                    disableGutters
                    key={index}
                    sx={{
                        // borderBottom: '1px solid #cccc',
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
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onClick={() => handleClickTreeItem(false, item.id)}>
                        <PersonOutlineIcon
                            sx={{
                                color: index % 3 == 1 ? '#5654A8' : index % 3 == 2 ? '#d525a1' : '#FF5677'
                            }}
                        />
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
                            title={item.tenNhomKhach}>
                            {item.tenNhomKhach}
                        </Typography>
                        {isHover &&
                            item.id !== '' &&
                            rowHover.id === item.id &&
                            !abpCustom.isGrandPermission('Pages.NhomKhach.Update') && (
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
        </>
    );
}
