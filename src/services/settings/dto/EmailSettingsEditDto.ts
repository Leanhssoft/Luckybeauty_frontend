export interface EmailSettingsEditDto {
    defaultFromAddress: string;
    defaultFromDisplayName: string;
    smtpHost: string;
    smtpPort: number;
    smtpUserName: string;
    smtpPassword: string;
    smtpDomain: string;
    smtpEnableSsl: boolean;
    smtpUseDefaultCredentials: boolean;
}
