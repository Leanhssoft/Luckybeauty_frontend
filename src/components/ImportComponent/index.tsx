import { Component, ReactNode } from 'react';
import './import.scss';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { FileUpload } from '../../services/dto/FileUpload';
interface ImportProps {
    isOpen: boolean;
    downloadImportTemplate: () => void;
    importFile: (input: FileUpload) => void;
    onClose: () => void;
}

class ImportExcel extends Component<ImportProps> {
    state = {
        filePath: '',
        fileUpload: {
            file: '',
            type: ''
        } as FileUpload,
        error: ''
    };
    chooseFile = () => {
        const fileInput = document.getElementById('input-select') as HTMLInputElement;
        fileInput.click();
    };

    handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                if (file.size <= 3145728) {
                    if (file?.name.match('\\.xlsx$')) {
                        const fileUpload = {
                            file: reader.result?.toString().split(',')[1],
                            type: '.xlsx'
                        };
                        this.setState({ fileUpload, filePath: file.name, error: '' });
                    } else {
                        this.setState({ error: 'File phải đúng dịnh dạng .xlsx!' });
                    }
                } else {
                    this.setState({ error: 'Kích cỡ của file phải <= 3MB !' });
                }
            };
        }
    };
    importFile = () => {
        const { fileUpload } = this.state;
        if (fileUpload === undefined || fileUpload.file === '' || fileUpload.type === '') {
            this.setState({ error: 'File import không được để trống.' });
        } else {
            this.props.importFile(fileUpload);
            this.setState({
                error: '',
                filePath: '',
                fileUpload: {
                    file: '',
                    type: ''
                }
            }); // Pass fileUpload data to the parent component
        }
    };
    render(): ReactNode {
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => {
                    this.props.onClose();
                    this.setState({
                        error: '',
                        filePath: '',
                        fileUpload: {
                            file: '',
                            type: ''
                        }
                    });
                }}>
                <DialogTitle>
                    <Typography variant="h6" fontSize="18px" color="#333233" fontWeight="600">
                        Import dữ liệu
                    </Typography>
                    <Button
                        onClick={this.props.onClose}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 'unset',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <div className="file-container">
                        <div className="file-drop-area">
                            <h5 className="text-primary">Vui lòng chọn file Excel để thực hiện import data</h5>
                            <div className="d-flex align-items-center">
                                <input
                                    hidden
                                    id="input-select"
                                    onChange={this.handleFileSelect}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    type={'file'}></input>
                                <button className="btn btn-sm btn-outline-primary" onClick={this.chooseFile}>
                                    Chọn file
                                </button>
                                {this.state.filePath && <span className="file-msg">{this.state.filePath}</span>}
                                {this.state.error && <span className="error-message">{this.state.error}</span>}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-primary" onClick={this.importFile}>
                        Import
                    </button>
                    <button className="btn btn-outline-primary mr-2" onClick={this.props.downloadImportTemplate}>
                        Download File mẫu
                    </button>
                    <button
                        className="btn btn-outline-secondary mr-2"
                        onClick={() => {
                            this.props.onClose();
                            this.setState({
                                error: '',
                                filePath: '',
                                fileUpload: {
                                    file: '',
                                    type: ''
                                }
                            });
                        }}>
                        Hủy bỏ
                    </button>
                </DialogActions>
            </Dialog>
        );
    }
}
export default ImportExcel;
