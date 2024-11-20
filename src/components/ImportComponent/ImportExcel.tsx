import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Button,
    DialogActions,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useEffect, useState } from 'react';
import { FileUpload } from '../../services/dto/FileUpload';
import utils from '../../utils/utils';

type PropsImportExcel = {
    tieude: string;
    listOption?: any;
    isOpen: boolean;
    isImporting?: boolean;
    onClose: () => void;
    downloadImportTemplate: () => void;
    importFile: (fileChosed: FileUpload) => void;
};

export default function ImportExcel({
    tieude,
    listOption,
    isOpen,
    isImporting = false,
    onClose,
    downloadImportTemplate,
    importFile
}: PropsImportExcel) {
    const [error, setError] = useState('');
    const [filePath, setFilePath] = useState('');
    const [fileSelect, setFileSelect] = useState<FileUpload>({} as FileUpload);

    useEffect(() => {
        setFilePath('');
        setError('');
        setFileSelect({} as FileUpload);
    }, [isOpen]);
    const chooseFile = () => {
        const fileInput = document.getElementById('input-select') as HTMLInputElement;
        fileInput.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (file.size <= 3145728) {
                    if (file?.name.match('\\.xlsx$')) {
                        const fileUpload = {
                            file: reader.result?.toString().split(',')[1],
                            type: '.xlsx'
                        } as FileUpload;
                        setFilePath(file.name);
                        setFileSelect(fileUpload);
                        setError('');
                    } else {
                        setError('Vui lòng nhập file đúng định dạng');
                    }
                } else {
                    setError('Kích cỡ của file phải <= 3MB');
                }
            };
        } else {
            setError('Vui lòng chọn file dữ liệu');
        }
    };
    const clickImport = () => {
        if (filePath === '') {
            setError('Vui lòng chọn file dữ liệu');
            return;
        }
        importFile(fileSelect);
    };
    return (
        <>
            <Dialog open={isOpen} maxWidth="sm" fullWidth onClose={onClose}>
                {isImporting && (
                    <CircularProgress
                        sx={{
                            position: 'absolute',
                            right: '40%',
                            top: '40%'
                        }}
                    />
                )}

                <DialogTitle className="modal-title">
                    {utils.checkNull(tieude) ? 'Nhập từ file excel' : tieude}
                    <CloseOutlinedIcon
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 20,
                            '&:hover': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                    />
                </DialogTitle>
                <DialogContent>
                    <Stack
                        spacing={2}
                        style={{
                            display: listOption != null && listOption.length > 0 ? '' : 'none'
                        }}>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group">
                            {listOption?.map((item: any, index: number) => (
                                <FormControlLabel key={index} control={<Radio />} label={item.text} />
                            ))}
                        </RadioGroup>
                    </Stack>
                    <Stack spacing={2}>
                        <Stack fontStyle={'italic'} spacing={1} alignItems={'flex-start'}>
                            <Typography variant="body2">
                                Tải về file mẫu (.xlsx) hoặc nhập file dữ liệu sẵn có
                            </Typography>
                            <Typography variant="body2">
                                Hệ thống chỉ cho phép nhập tối đa 10000 dòng mỗi lần từ file
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<VerticalAlignBottomOutlinedIcon />}
                                onClick={downloadImportTemplate}>
                                Tải xuống
                            </Button>
                        </Stack>

                        <Stack spacing={1}>
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <Typography variant="body2" fontWeight={600}>
                                    Tải file dữ liệu lên
                                </Typography>
                                <span style={{ fontSize: '12px', color: 'red', fontStyle: 'italic' }}>{error}</span>
                            </Stack>

                            <Stack>
                                <TextField
                                    fullWidth
                                    sx={{ '& input': { fontWeight: 600 } }}
                                    value={filePath}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Stack position={'relative'}>
                                                    <input
                                                        hidden
                                                        id="input-select"
                                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                        type={'file'}
                                                        onChange={handleFileSelect}></input>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={chooseFile}
                                                        startIcon={<FileUploadOutlinedIcon />}>
                                                        Chọn file
                                                    </Button>
                                                </Stack>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Thoát
                    </Button>
                    {isImporting ? (
                        <Button variant="contained">Đang lưu</Button>
                    ) : (
                        <Button variant="contained" onClick={clickImport}>
                            Import
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
