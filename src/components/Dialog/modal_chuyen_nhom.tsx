import { useState } from 'react';
import { IList } from '../../services/dto/IList';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CmpIListData from '../ListData/CmpIListData';
import DialogButtonClose from './ButtonClose';

export function ModalChuyenNhom({ title, icon, isOpen, onClose, lstData, agreeChuyenNhom }: any) {
    const [itemChosed, setItemChosed] = useState<IList>();
    const choseNhom = (isEdit: boolean, item: any) => {
        setItemChosed(item);
    };
    const clickAgree = () => {
        agreeChuyenNhom(itemChosed);
    };
    return (
        <>
            <Dialog open={isOpen} fullWidth maxWidth="xs" onClose={onClose}>
                <DialogTitle>
                    {title}
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <CmpIListData Icon={icon} lst={lstData} clickTreeItem={choseNhom} isShowAll={false} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button variant="contained" onClick={clickAgree}>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
