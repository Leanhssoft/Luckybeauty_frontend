import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export default function CustomCkeditor({ html, handleChange }: any) {
    const editorConfiguration = {
        toolbar: {
            // item: [
            //     'sourceEditing',
            //     '|',
            //     'bold',
            //     'italic',
            //     'underline',
            //     'todoList',
            //     '|',
            //     'link',
            //     // 'imageUpload',
            //     'imageInsert',
            //     'insertTable',
            //     'undo',
            //     'redo',
            //     '|',
            //     'fontSize',
            //     'fontFamily',
            //     'alignment',
            //     '-',
            //     'fontBackgroundColor',
            //     'fontColor',
            //     '|',
            //     'specialCharacters',
            //     'subscript',
            //     'superscript',
            //     'pageBreak',
            //     '|',
            //     'style',
            //     'heading',
            //     'bulletedList',
            //     'numberedList',
            //     'horizontalLine'
            // ],
            shouldNotGroupWhenFull: true
        },
        fontSize: {
            options: [11, 12, 13, 14, 15, 16, 17, 18, 19]
        }
    };

    return (
        <>
            <CKEditor
                editor={Editor}
                config={editorConfiguration}
                data={html}
                onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    handleChange(data);
                }}
                // onBlur={(event, editor) => {
                //     console.log('Blur.', editor);
                // }}
                // onFocus={(event, editor) => {
                //     console.log('Focus.', editor);
                // }}
            />
        </>
    );
}
