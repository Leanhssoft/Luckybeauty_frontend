import NameValueDto from '../../dto/NameValueDto';
import CreateOrEditEditionDto from './CreateOrEditEditionDto';
import FlatFeatureDto from './FlatFeatureDto';

export default interface GetEditionEditOutput {
    edition: CreateOrEditEditionDto;
    featureValues: NameValueDto[];
    features: FlatFeatureDto[];
}
