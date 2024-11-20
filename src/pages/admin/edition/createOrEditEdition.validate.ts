import * as Yup from 'yup';

const rules = Yup.object().shape({
    edition: Yup.object().shape({
        name: Yup.string().required('Tên phiên bản không được để trống'),
        displayName: Yup.string().required('Tên hiển thị không được để trống')
    })
});

export default rules;
