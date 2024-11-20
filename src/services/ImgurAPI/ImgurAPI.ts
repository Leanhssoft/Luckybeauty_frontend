import axios from 'axios';
import utils from '../../utils/utils';
import Cookies from 'js-cookie';

export interface Imgur_ModelBasic {
    id: string;
    deletehash: string;
}

export interface ImgurCommonDto<T> {
    status: number;
    success: boolean;
    data?: T;
}

export interface Imgur_ImageDetailDto {
    id: string;
    deletehash: string;
    title: string;
    link: string;
    width: number;
    height: number;
    size: number;
}
export interface Imgur_AlbumDetailDto {
    id: string;
    deletehash: string;
    title: string;
    link: string;
    images_count: number;
    privacy: string; // "hidden", "public"
    views: number;
}

export interface IResultToken {
    accessToken: string;
    refresh_token: string;
    expires_in: number;
}

const Imgur_URLApi = `https://api.imgur.com/3/`;

class ImgurAPI {
    Generate_AccessToken = async (): Promise<IResultToken | null> => {
        try {
            const formdata = new FormData();
            formdata.append('refresh_token', `${process.env.REACT_APP_IMGUR_REFRESH_TOKEN}`);
            formdata.append('client_id', `${process.env.REACT_APP_IMGUR_CLIENT_ID}`);
            formdata.append('client_secret', `${process.env.REACT_APP_IMGUR_CLIENT_SECRET}`);
            formdata.append('grant_type', 'refresh_token');

            const response = await axios.post(`https://api.imgur.com/oauth2/token`, formdata);
            console.log('respone ', response);
            if (response.status == 200) {
                const data = response?.data;
                Cookies.set('Imgur_accessToken', data.access_token, {
                    expires: new Date(new Date().getTime() + 1000 * data.expires_in)
                });
                Cookies.set('Imgur_refreshToken', data.refresh_token);
                return data;
            }
            return null;
        } catch {
            return null;
        }
    };
    GetAccessToken = async (): Promise<string> => {
        let accessToken = Cookies.get('Imgur_accessToken');
        if (utils.checkNull(accessToken)) {
            const newToken = await this.Generate_AccessToken();
            if (newToken !== null) {
                accessToken = newToken.accessToken;
            }
        }
        return accessToken ?? '';
    };

    GetAccSetting = async () => {
        try {
            const accessToken = await this.GetAccessToken();
            if (accessToken != '') {
                const response = await axios.get(`${Imgur_URLApi}account/me/settings`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                return response.data?.data;
            }
            return null;
        } catch {
            return null;
        }
    };
    GetAllAlbum_WithAccount = async (): Promise<Imgur_AlbumDetailDto[]> => {
        try {
            const accessToken = await this.GetAccessToken();
            if (accessToken !== '') {
                const account = await this.GetAccSetting();
                if (account !== null) {
                    const response = await axios.get(`${Imgur_URLApi}account/${account.account_url}/albums`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    return response.data?.data;
                }
            }
            return [] as Imgur_AlbumDetailDto[];
        } catch {
            return [] as Imgur_AlbumDetailDto[];
        }
    };
    FindAlbumIdExists_InImgur = async (albumName: string): Promise<string> => {
        if (utils.checkNull(albumName)) return '';
        const allAlbums = await this.GetAllAlbum_WithAccount();
        if (allAlbums !== undefined && allAlbums?.length > 0) {
            const albumItem = allAlbums?.filter((x) => x.title === `${albumName}`);
            if (albumItem?.length > 0) {
                return albumItem[0]?.id;
            }
        }
        return '';
    };
    GetFile_fromId = async (fileId = 'mVu3TZz'): Promise<Imgur_ImageDetailDto | null> => {
        if (utils.checkNull(fileId) || fileId?.includes(`http`)) return null;
        try {
            const response = await axios.get(`${Imgur_URLApi}image/${fileId}`, {
                headers: {
                    Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
                }
            });
            return response.data?.data;
        } catch {
            return null;
        }
    };
    GetImage_fromAlbum = async (albumId: string, fileId = 'mVu3TZz'): Promise<Imgur_ImageDetailDto | null> => {
        if (utils.checkNull(fileId) || fileId?.includes(`http`)) return null;
        const accessToken = await this.GetAccessToken();
        if (accessToken !== '') {
            const response = await axios.get(`${Imgur_URLApi}album/${albumId}/image/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                return response.data?.data;
            }
        }
        return null;
    };
    UploadImage = async (imageFile: File, description = ''): Promise<Imgur_ImageDetailDto | null> => {
        const accessToken = await this.GetAccessToken();
        if (accessToken !== '') {
            const formData = new FormData();
            formData.append('image', imageFile, imageFile?.name);
            formData.append('type', 'image');
            formData.append('title', imageFile?.name);
            formData.append('description', utils.checkNull(description) ? `#${imageFile?.name}` : description);

            const response = await axios.post(`${Imgur_URLApi}image`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                return response.data?.data;
            }
        }

        return null;
    };
    RemoveImage = async (imageId: string): Promise<boolean> => {
        const accessToken = await this.GetAccessToken();
        if (accessToken !== '') {
            const response = await axios.delete(`${Imgur_URLApi}image/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) return true;
        }
        return false;
    };
    GetAlbumDetails_byId = async (albumId = 'irQhxYt'): Promise<Imgur_AlbumDetailDto[]> => {
        if (utils.checkNull(albumId)) return [];
        try {
            const response = await axios.get(`${Imgur_URLApi}album/${albumId}`, {
                headers: {
                    Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
                }
            });
            return response.data?.data;
        } catch {
            return [];
        }
    };
    CreateNewAlbum = async (alBumTitle: string, description = ''): Promise<Imgur_ModelBasic | null> => {
        const accessToken = await this.GetAccessToken();
        try {
            const response = await axios.post(
                `${Imgur_URLApi}album`,
                {
                    title: alBumTitle,
                    description: utils.checkNull(description) ? `#${alBumTitle}` : `${description}`
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                return response.data.data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };
    RemoveAlbum = async (albumId: string): Promise<boolean> => {
        // mối ảnh trên Imgur chứa 1 Id duy nhất
        // chỉ cần xóa ảnh theo Id --> ảnh sẽ tự động bị xóa khỏi album
        const accessToken = await this.GetAccessToken();
        if (accessToken !== '') {
            const response = await axios.delete(`${Imgur_URLApi}album/${albumId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.status === 200;
        }
        return false;
    };

    AddImageToAlbum_WithImageId = async (albumId: string, imageId: string): Promise<Imgur_ImageDetailDto | null> => {
        const accessToken = await this.GetAccessToken();
        let coverImg = imageId;
        // nếu add nhiều ảnh
        if (imageId.split(',')?.length > 0) {
            coverImg = imageId.split(',')[0];
        }
        try {
            const accessToken = await this.GetAccessToken();
            if (accessToken !== '') {
                const response = await axios.put(
                    `${Imgur_URLApi}album/${albumId}/add`,
                    {
                        ids: imageId,
                        cover: coverImg
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                if (response.status === 200) {
                    return response.data.data;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    GetAllImage_fromAlbum = async (albumId: string): Promise<Imgur_ImageDetailDto[] | null> => {
        if (utils.checkNull(albumId)) return null;
        try {
            const accessToken = await this.GetAccessToken();
            if (accessToken !== '') {
                const response = await axios.get(`${Imgur_URLApi}album/${albumId}/images`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (response.status == 200) {
                    return response.data?.data;
                }
            }

            return null;
        } catch {
            return null;
        }
    };
    RemoveAllImage_inAlbum = async (albumId: string): Promise<boolean> => {
        // lấy danh sách các ảnh thuộc album
        const allImages = await this.GetAllImage_fromAlbum(albumId);
        if (allImages !== null) {
            let count = 0;
            allImages?.forEach(async (img: any) => {
                // xóa lần lượt từng ảnh
                const deleteResponse = await this.RemoveImage(img.id);
                if (deleteResponse) count += 1;
            });
            return count == allImages?.length;
        } else {
            return false;
        }
    };

    // trường Image trong database được lưu dạng: albumId/imageId
    GetInforRootAlbum_fromDataImage = (imagePath: string): Imgur_ModelBasic => {
        const data = {
            id: '',
            deletehash: ''
        } as Imgur_ModelBasic;
        if (!utils.checkNull(imagePath)) {
            const image_album = imagePath.split('/');

            switch (image_album?.length) {
                case 3:
                    {
                        const parentAlbum = image_album[0].split('-');
                        switch (parentAlbum?.length) {
                            case 1:
                                {
                                    data.id = parentAlbum[0];
                                }
                                break;
                            case 2:
                                {
                                    data.id = parentAlbum[0];
                                    data.deletehash = parentAlbum[1];
                                }
                                break;
                        }
                    }
                    break;
            }
        }
        return data;
    };
    GetInforSubAlbum_fromDataImage = (imagePath: string): Imgur_ModelBasic => {
        const data = {
            id: '',
            deletehash: ''
        } as Imgur_ModelBasic;
        if (!utils.checkNull(imagePath)) {
            const image_album = imagePath.split('/');

            if ((image_album?.length ?? 0) > 0) {
                const subAlbum = image_album[0].split('-');
                switch (subAlbum?.length) {
                    case 1:
                        {
                            data.id = subAlbum[0];
                        }
                        break;
                    case 2:
                        {
                            data.id = subAlbum[0];
                            data.deletehash = subAlbum[1];
                        }
                        break;
                }
            }
        }
        return data;
    };
    GetInforImage_fromDataImage = (imagePath: string): Imgur_ModelBasic => {
        const data = {
            id: '',
            deletehash: ''
        } as Imgur_ModelBasic;
        if (!utils.checkNull(imagePath)) {
            const image_album = imagePath.split('/');
            if (image_album?.length > 1) {
                const image = image_album[1].split('-');
                switch (image?.length) {
                    case 1:
                        {
                            data.id = image[0];
                        }
                        break;
                    case 2:
                        {
                            data.id = image[0];
                            data.deletehash = image[1];
                        }
                        break;
                }
            }
        }
        return data;
    };
}
export default new ImgurAPI();
