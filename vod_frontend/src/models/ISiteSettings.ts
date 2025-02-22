

export interface ISiteSettings {
    id: string;
    siteName: string;
    siteTitle: string;
    siteDescription: string;
    siteTheme: {
        titleColor: string;
        fontSize: string;
        fontFamily: string;
        textShadow: string;
        backgroundColor: string;
        backgroundImage: string;
    }
    siteLogo: string;
    siteFavicon: string;
    siteLanguage: string;
    isActive: boolean;
}