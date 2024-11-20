import * as Yup from 'yup';
const rules = Yup.object().shape({
    name: Yup.string().required('Tên vai trò là bắt buộc'),
    displayName: Yup.string().required('Tên hiển thị là bắt buộc')
});
export default rules;
