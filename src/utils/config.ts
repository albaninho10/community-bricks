import { isStaging, isProduction } from "@services/env";

export const Config = {
    AWS_HOST_PROD: 'https://http-api.fedr.club',
    AWS_HOST_STAGING: 'https://http-api.fedr.club',
    AWS_HOST_DEV: 'https://http-api.fedr.club',
    get AWS_HOST() {
        return isProduction() ? this.AWS_HOST_PROD
            : isStaging() ? this.AWS_HOST_STAGING
                : this.AWS_HOST_DEV;
    },
    CDN_HOST_PROD: 'https://pub-388e882330ee44c7b74215d8e0935cb9.r2.dev/',
    CDN_HOST_STAGING: 'https://pub-388e882330ee44c7b74215d8e0935cb9.r2.dev/',
    CDN_HOST_DEV: 'https://pub-388e882330ee44c7b74215d8e0935cb9.r2.dev/',
    get CDN_HOST() {
        return isProduction() ? this.CDN_HOST_PROD
            : isStaging() ? this.CDN_HOST_STAGING
                : this.CDN_HOST_DEV;
    },
    COMMUNITY_ID: 70
}
