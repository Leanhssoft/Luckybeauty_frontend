import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { useState } from 'react';
import { OpenInNew, LocalOfferOutlined } from '@mui/icons-material';
import { ModelNhomHangHoa } from '../../services/product/dto';
import abpCustom from '../abp-custom';

export default function AccordionNhomHangHoa({ dataNhomHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<ModelNhomHangHoa>(new ModelNhomHangHoa({ id: '' }));
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');

    const handleHover = (event: React.MouseEvent<HTMLDivElement>, rowData: any) => {
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
        clickTreeItem(isEdit, rowHover);
        setIdChosing(idChosing);
    };
    return (
        <>
            {dataNhomHang.map((item: any, index: number) => (
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
                            '&:hover': {
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                        onMouseLeave={(event) => {
                            handleHover(event, item);
                        }}
                        onMouseEnter={(event) => {
                            handleHover(event, item);
                        }}
                        onClick={() => handleClickTreeItem(false, item.id)}>
                        <LocalOfferOutlined sx={{ color: item.color, width: 20, height: 20 }} />
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
                            title={item.tenNhomHang}>
                            {item.tenNhomHang}
                        </Typography>
                        {isHover && item.id !== '' && rowHover.id === item.id && (
                            <OpenInNew
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleClickTreeItem(true, item.id);
                                }}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    display: abpCustom.isGrandPermission('Pages.DM_NhomHangHoa.Edit') ? '' : 'none'
                                }}
                            />
                        )}
                    </AccordionSummary>

                    {item.children?.map((child: any, index2: number) => (
                        <AccordionDetails
                            key={index2}
                            sx={{
                                padding: '8px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                margin: 'auto',
                                bgcolor: idChosing === child.id ? '#F2EBF0' : '',
                                '&:hover': {
                                    bgcolor: '#F2EBF0'
                                }
                            }}
                            onMouseLeave={(event) => {
                                handleHover(event, child);
                            }}
                            onMouseEnter={(event) => {
                                handleHover(event, child);
                            }}
                            onClick={() => handleClickTreeItem(false, child.id)}>
                            <LocalOfferOutlined sx={{ color: item.color, opacity: '0', width: 20, height: 20 }} />
                            <Typography
                                variant="body2"
                                textTransform="capitalize"
                                sx={{
                                    cursor: 'poitner',
                                    marginLeft: '9px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1
                                }}
                                title={child.tenNhomHang}>
                                {child.tenNhomHang}
                            </Typography>
                            {isHover && rowHover.id === child.id && (
                                <OpenInNew
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleClickTreeItem(true, child.id);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        right: 16,
                                        display: abpCustom.isGrandPermission('Pages.DM_NhomHangHoa.Edit') ? '' : 'none'
                                    }}
                                />
                            )}
                        </AccordionDetails>
                    ))}
                </Accordion>
            ))}
        </>
    );
}
