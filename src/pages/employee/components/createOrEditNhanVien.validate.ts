import * as Yup from 'yup';
import AppConsts from '../../../lib/appconst';
const rules = Yup.object().shape({
    // ho: Yup.string().required('Họ là bắt buộc'),
    // tenLot: Yup.string().required('Tên là bắt buộc'),
    tenNhanVien: Yup.string().required('Họ và tên không được để trống'),
    emailAddress: Yup.string().matches(AppConsts.emailRegex, 'Email không hợp lệ'),
    soDienThoai: Yup.string().matches(AppConsts.phoneRegex, 'Số điện thoại không hợp lệ')
    // idChucVu: Yup.string().required('Vị trí nhân viên không được để trống')
});
export default rules;
