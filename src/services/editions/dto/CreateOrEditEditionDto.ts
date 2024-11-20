import NameValueDto from '../../dto/NameValueDto';
import EditionDto from './EditionDto';

export default interface CreateOrEditEditionDto {
    edition: EditionDto;
    featureValues: NameValueDto[];
}
