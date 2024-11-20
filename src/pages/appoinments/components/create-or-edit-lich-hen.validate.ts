import * as Yup from 'yup';
const rules = Yup.object().shape({
    idDonViQuiDoi: Yup.string().required('Dịch vụ không được để trống'),
    idKhachHang: Yup.string().required('Khách hàng không được để trống'),
    startTime: Yup.string().required('Vui lòng chọn ngày làm dịch vụ'),
    startHours: Yup.string().required('Vui lòng chọn thời gian làm dịch vụ')
});
export default rules;
