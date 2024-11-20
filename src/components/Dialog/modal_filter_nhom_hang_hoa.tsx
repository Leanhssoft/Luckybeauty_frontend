import { FC, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

import TreeViewGroupProduct from '../Treeview/ProductGroup';

import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { IList } from '../../services/dto/IList';
import DialogButtonClose from './ButtonClose';

type IPropModalFilter = {
    isShow: boolean;
    // arrIDChosed?: string[];
    onClose: () => void;
    onAgree: (arrId: string[]) => void;
};

const ModalFilterNhomHangHoa = (props: IPropModalFilter) => {
    const { isShow, onClose, onAgree } = props;
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [allNhomHang, setAllNhomHang] = useState<ModelNhomHangHoa[]>([]);

    const getTreeNhomHangHoa = async () => {
        const data = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHang(data?.items);
    };

    useEffect(() => {
        setArrIdChosed([]);
    }, [isShow]);

    useEffect(() => {
        getTreeNhomHangHoa();
    }, []);

    const onCloseModal = () => {
        onClose();
    };

    const clickAgree = () => {
        onAgree(arrIdChosed);
    };

    return (
        <Dialog open={isShow} fullWidth maxWidth="sm" onClose={onClose}>
            <DialogTitle>
                <Typography fontSize={'18px'} fontWeight={500}>
                    Chọn nhóm hàng
                </Typography>
                <DialogButtonClose onClose={onClose} />
            </DialogTitle>
            <DialogContent>
                <TreeViewGroupProduct
                    roleEdit={false}
                    // arrIdChosedDefault={arrIDChosed}
                    lstData={allNhomHang?.map((x) => {
                        return {
                            id: x.id,
                            text: x.tenNhomHang,
                            text2: x?.tenNhomHang_KhongDau,
                            color: x.color,
                            icon: <LocalOffer sx={{ width: 16 }} />,
                            children: x?.children?.map((o) => {
                                return {
                                    id: o.id,
                                    text: o.tenNhomHang,
                                    text2: o?.tenNhomHang_KhongDau
                                };
                            })
                        } as IList;
                    })}
                    clickTreeItem={(isEdit, arrId) => {
                        if (arrId) {
                            setArrIdChosed([...arrId]);
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onCloseModal}>
                    Bỏ qua
                </Button>
                <Button variant="contained" onClick={clickAgree}>
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalFilterNhomHangHoa;
