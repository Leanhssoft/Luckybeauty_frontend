import { Dialog, DialogContent } from '@mui/material';
import { IPropModal } from '../../services/dto/IPropsComponent';
import { IBankInfor } from '../../services/bao_kim_payment/BaoKimDto';

export default function QRCodeBaoKim({ isShowModal, objUpDate, onClose, onOK }: IPropModal<IBankInfor>) {
    return (
        <>
            <Dialog open={isShowModal} onClose={onClose}>
                <DialogContent>
                    <img src={objUpDate?.qrPath} />
                </DialogContent>
            </Dialog>
        </>
    );
}
