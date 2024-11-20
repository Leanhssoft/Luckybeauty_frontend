import NameValueDto from '../../dto/NameValueDto';
import FlatFeatureDto from './FlatFeatureDto';

export interface GetFeatureOutput {
    featureValues: NameValueDto[];
    features: FlatFeatureDto[];
}
