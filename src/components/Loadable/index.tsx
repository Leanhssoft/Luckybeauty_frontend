import React, { Suspense } from 'react';
import Loading from './../Loading/index';

const LoadableComponent = (component: any) => {
    const LazyComponent = React.lazy(component);

    const Loadable = () => {
        return (
            <Suspense fallback={<Loading />}>
                <LazyComponent />
            </Suspense>
        );
    };

    return Loadable;
};

export default LoadableComponent;
